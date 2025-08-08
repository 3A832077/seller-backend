import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../service/supabase.service';
echarts.use([BarChart, GridComponent, CanvasRenderer, PieChart,
  TooltipComponent, LegendComponent, LineChart]);

@Component({
  selector: 'app-dashboard',
  imports: [
             CommonModule, NzGridModule, NzCardModule,
             NzStatisticModule, NgxEchartsDirective, MatTooltipModule,
             NzRateModule, FormsModule
           ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    provideEchartsCore({ echarts }),
  ]
})
export class DashboardComponent implements OnInit {

  barOptions: any = {};

  pieOptions: any = {};

  isBrowser: boolean;

  categorySales: any[] = [];

  salesAmount: number = 0;

  orderCount: number = 0;

  orderComment: number = 0;

  aov: number = 0;

  constructor(
                @Inject(PLATFORM_ID) platformId: Object,
                public supabase: SupabaseService
             ) {
                this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.getCategorySales();
  }

  /**
   * 取得類別銷售量
   */
  getCategorySales() {
    this.supabase.getCategorySales()?.then(({ data, error }) => {
      if (error) {
        console.error(error);
      }
      else{
        // 彙總各類別銷售量
        const categorySales: any = {};
        data.forEach((item: any) => {
          const category = item.products && item.products.categories.name ? item.products.categories.name : undefined;
          if (category) {
            categorySales[category] = (categorySales[category] || 0) + item.quantity;
          }
        });
        // 轉換成陣列
        this.categorySales = Object.entries(categorySales).map(([category, sales]) => ({
          category,
          sales
        }));
        this.getBarOptions();
        this.getPieOptions();
        this.getOrderInfo();
      }
    });
  }


  /**
   * 計算類別百分比
   * @returns
   */
  calcCategoryPercent() {
    const totalSales = this.categorySales.reduce((sum, item) => sum + item.sales, 0);
    const percentData = this.categorySales.map(item => ({
      name: item.category,
      value: totalSales === 0 ? 0 : Math.round((item.sales / totalSales) * 100)
    }));
    return percentData;
  }

  /**
   * 取得折線圖
   */
  getBarOptions() {
    const colors = ['#5470C6', '#91CC75', '#EE6666', '#FFB980', '#73C0DE',
      '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'];
    this.barOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      legend: {
        data: ['銷售額'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.categorySales.map(item => item.category)
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '銷售額',
          type: 'line',
          data: this.categorySales.map(item => item.sales),
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: (params: any) => {
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
  }

  /**
   * 取得長條圖
   */
  getPieOptions() {
    this.pieOptions = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '類別',
          type: 'pie',
          radius: '80%',
          data: this.calcCategoryPercent(),
        }
      ]
    };
  }

  /**
   * 取得訂單資訊
   */
  getOrderInfo(){
    this.supabase.getAllOrders()?.then(({ data, error, count }) => {
      if (error) {
        console.error(error);
      }
      else{
        this.orderCount = count ?? 0;
        data.forEach((item: any) => {
          this.salesAmount += item.total;
          if (item.comment) {
            this.orderComment += 1;
          }
        });
        this.aov = this.orderCount > 0 ? this.salesAmount / this.orderCount : 0;
      }
    });
  }

}
