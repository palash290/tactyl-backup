// $(document).ready(function () {
//   $(".ct_menu_bar").click(function () {
//     $("main").addClass("ct_show");
//   });
//   $(".ct_close_sidebar").click(function () {
//     $("main").removeClass("ct_show");
//   });

//   //   Dash Graph js S
// });


// // Sample Data – you can replace it with your dynamic data
// let options = {
//     chart: {
//         type: 'line',
//         height: 350,
//          toolbar: {
//         show: false
//     }
//     },
    
//     series: [
//         {
//             name: 'Performance',
//             data: [10, 25, 15, 40, 35, 50, 45]
//         }
//     ],
//     xaxis: {
//         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
//     },
//     stroke: {
//         width: 3,
//         curve: 'smooth'
//     },
//     markers: {
//         size: 4
//     },
//     colors: ['#4f46e5'], // Indigo color
//     title: {
//         align: 'left'
//     }
// };

// let chart = new ApexCharts(
//     document.querySelector("#ct_Performance_graph"),
//     options
// );

// chart.render();



// var options2 = {
//    chart: {
//         type: 'donut',
//         height: 300,
//         toolbar: { show: false },
//         offsetX: 0,   // Center horizontally
//         offsetY: 0    // Center vertically
//     },
//     series: [45, 35, 20],
//     labels: ["Design Review", "Development", "QA Testing"],
//     colors: ["#4db8ff", "#3d6f4a", "#a5e3df"],
    
//     plotOptions: {
//         pie: {
//             donut: {
//                 size: '70%',
//                 labels: {
//                     show: true,      
//                     name: {
//                         show: true
//                     },
//                     value: {
//                         show: true
//                     },
//                     total: {
//                         show: true
//                     }
//                 }
//             }
//         }
//     },

//     legend: {
//         position: 'bottom',
//         fontSize: '14px',
//         markers: {
//             width: 10,
//             height: 10,
//             radius: 50
//         }
//     },

//     dataLabels: {
//         enabled: false
//     }
// };

// var chart2 = new ApexCharts(
//     document.querySelector("#ct_task_by_phase"),
//     options2
// );

// chart2.render();



