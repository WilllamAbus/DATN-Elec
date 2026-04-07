// src/components/Admin/Scripts.tsx
import React, { useEffect } from 'react';

const Scripts: React.FC = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js';
    script1.defer = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js';
    script2.integrity = 'sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=';
    script2.crossOrigin = 'anonymous';
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
    script3.integrity = 'sha256-R4pqcOYV8lt7snxMQO/HSbVCFRPMdrhAFMH+vr9giYI=';
    script3.crossOrigin = 'anonymous';
    document.body.appendChild(script3);

    // const initCharts = () => {
    //   // Chart initialization code
    //   var chartOne = document.getElementById('chartOne');
    // //   new Chart(chartOne, {
    // //     type: 'bar',
    // //     data: {
    // //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    // //       datasets: [
    // //         {
    // //           label: '# of Votes',
    // //           data: [12, 19, 3, 5, 2, 3],
    // //           backgroundColor: [
    // //             'rgba(255, 99, 132, 0.2)',
    // //             'rgba(54, 162, 235, 0.2)',
    // //             'rgba(255, 206, 86, 0.2)',
    // //             'rgba(75, 192, 192, 0.2)',
    // //             'rgba(153, 102, 255, 0.2)',
    // //             'rgba(255, 159, 64, 0.2)',
    // //           ],
    // //           borderColor: [
    // //             'rgba(255, 99, 132, 1)',
    // //             'rgba(54, 162, 235, 1)',
    // //             'rgba(255, 206, 86, 1)',
    // //             'rgba(75, 192, 192, 1)',
    // //             'rgba(153, 102, 255, 1)',
    // //             'rgba(255, 159, 64, 1)',
    // //           ],
    // //           borderWidth: 1,
    // //         },
    // //       ],
    // //     },
    // //     options: {
    // //       scales: {
    // //         yAxes: [
    // //           {
    // //             ticks: {
    // //               beginAtZero: true,
    // //             },
    // //           },
    // //         ],
    // //       },
    // //     },
    // //   });

    // //   var chartTwo = document.getElementById('chartTwo');
    // //   new Chart(chartTwo, {
    // //     type: 'line',
    // //     data: {
    // //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    // //       datasets: [
    // //         {
    // //           label: '# of Votes',
    // //           data: [12, 19, 3, 5, 2, 3],
    // //           backgroundColor: [
    // //             'rgba(255, 99, 132, 0.2)',
    // //             'rgba(54, 162, 235, 0.2)',
    // //             'rgba(255, 206, 86, 0.2)',
    // //             'rgba(75, 192, 192, 0.2)',
    // //             'rgba(153, 102, 255, 0.2)',
    // //             'rgba(255, 159, 64, 0.2)',
    // //           ],
    // //           borderColor: [
    // //             'rgba(255, 99, 132, 1)',
    // //             'rgba(54, 162, 235, 1)',
    // //             'rgba(255, 206, 86, 1)',
    // //             'rgba(75, 192, 192, 1)',
    // //             'rgba(153, 102, 255, 1)',
    // //             'rgba(255, 159, 64, 1)',
    // //           ],
    // //           borderWidth: 1,
    // //         },
    // //       ],
    // //     },
    // //     options: {
    // //       scales: {
    // //         yAxes: [
    // //           {
    // //             ticks: {
    // //               beginAtZero: true,
    // //             },
    // //           },
    // //         ],
    // //       },
    // //     },
    // //   });
    // };

    // script3.onload = initCharts;

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
    };
  }, []);

  return null;
};

export default Scripts;
