import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FormsModule } from '@angular/forms';
echarts.use([BarChart, GridComponent, CanvasRenderer, PieChart]);

@Component({
  selector: 'app-welcome',
  imports: [
             CommonModule, NzGridModule, NzCardModule,
             NzStatisticModule, NgxEchartsDirective, MatTooltipModule,
             NzRateModule, FormsModule
           ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [
    provideEchartsCore({ echarts }),
  ]
})
export class WelcomeComponent implements OnInit {

  barOptions = {
    title: {
      text: '每月銷售',
    },
    tooltip: {},
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
    },
    yAxis: {},
    series: [
      {
        name: '銷售額',
        type: 'bar',
        data: [500, 200, 360, 100, 800, 300],
        itemStyle: {
          color: '#1890ff'
        }
      },
    ],
  };

  pieOptions = {
    title: {
      text: '類別占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '來源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '手機' },
          { value: 735, name: '筆電' },
          { value: 580, name: '家電' },
          { value: 484, name: '其他' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  isBrowser: boolean;

  constructor(
                @Inject(PLATFORM_ID) platformId: Object
             ) {
                this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {

  }

}
