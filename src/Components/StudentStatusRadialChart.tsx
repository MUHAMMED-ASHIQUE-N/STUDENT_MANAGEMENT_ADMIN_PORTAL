

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Active", value: 300 },
  { name: "Completed", value: 120 },
  { name: "Dropped", value: 50 },
];

const COLORS = ["#2196F3", "#4CAF50", "#F44336"]; 
// Blue, Green, Red

const StudentStatusPieChart: React.FC = () => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">
        Student Status Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}   // donut style
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend layout="vertical" verticalAlign="middle" align="right" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentStatusPieChart;


// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase/config"; // adjust path to your config

// // Custom label to show percentage inside each segment
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
//   const RADIAN = Math.PI / 180;
//   const radius = innerRadius + (outerRadius - innerRadius) / 2;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text
//       x={x}
//       y={y}
//       fill="white"
//       textAnchor={x > cx ? "start" : "end"}
//       dominantBaseline="central"
//       fontSize={14}
//       fontWeight="bold"
//     >
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// const COLORS = ["#2196F3", "#4CAF50", "#F44336"]; 
// // Active, Completed, Dropped

// const StudentStatusPieChart: React.FC = () => {
//   const [chartData, setChartData] = useState([
//     { name: "Active", value: 0 },
//     { name: "Completed", value: 0 },
//     { name: "Dropped", value: 0 },
//   ]);

//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "students"), (snapshot) => {
//       let active = 0;
//       let completed = 0;
//       let dropped = 0;

//       snapshot.forEach((doc) => {
//         const student = doc.data();
//         if (student.status === "active") active++;
//         if (student.status === "completed") completed++;
//         if (student.status === "dropped") dropped++;
//       });

//       setChartData([
//         { name: "Active", value: active },
//         { name: "Completed", value: completed },
//         { name: "Dropped", value: dropped },
//       ]);
//     });

//     return () => unsub();
//   }, []);

//   return (
//     <div className="w-full h-96 p-4 bg-white rounded-2xl shadow-md">
//       <h2 className="text-xl font-semibold text-center mb-4">
//         Student Status Overview
//       </h2>
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart>
//           <Pie
//             data={chartData}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={renderCustomizedLabel}
//             innerRadius={80}
//             outerRadius={120}
//             paddingAngle={5}
//             dataKey="value"
//           >
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Legend layout="vertical" verticalAlign="middle" align="right" />
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default StudentStatusPieChart;
