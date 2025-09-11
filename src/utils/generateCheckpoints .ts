
// export interface Checkpoint {
//     title: string;
//     amount: number;
//     dueOrder: number;
// }


// export const generateCheckpoints = (
//     totalFee: number,
//     admissionFee: number,
//     advanceFee: number = 0,
//     duration: number,
//     customCheckpoints: Checkpoint[] = []
// ): Checkpoint[] => {


//     let checkpoints: Checkpoint[] = [];
//     let order = 0;
//     let remainingFee = totalFee ;

// const validCustom = customCheckpoints.filter(  (cp) => cp.title.trim() !== "" && cp.amount > 0  );
  
//    const hasAdmission = validCustom.some(cp => cp.title.toLowerCase() === "admission fee");
//   const hasAdvance = validCustom.some(cp => cp.title.toLowerCase() === "advance fee");

//     if (admissionFee > 0 && !hasAdmission) {
//         checkpoints.push({ title: "Admission Fee", amount: admissionFee, dueOrder: order++ });
//         remainingFee -= admissionFee;
//     }

//     if (advanceFee > 0 && !hasAdvance) {
        
//         checkpoints.push({ title: "Advance Fee", amount: advanceFee, dueOrder: order++ });
//         remainingFee -= advanceFee;
//     }

 
//      if (validCustom.length > 0) {
//     return [
//       ...checkpoints,
//       ...customCheckpoints.map((cp, i) => ({
//         ...cp,
//         dueOrder: order + i
//       }))
//     ];
//   }

//     const installmentCount = duration - checkpoints.length; // admission counted already
//     if (installmentCount > 0 && remainingFee > 0) {
//         const installmentAmount = Math.floor(remainingFee / installmentCount);
//         const lastInstallment = installmentAmount + (remainingFee % installmentCount);

//         for (let i = 1; i <= installmentCount; i++) {
//             checkpoints.push({
//                 title: `Installment ${i}`,
//                 amount: i === installmentCount ? lastInstallment : installmentAmount,
//                 dueOrder: order++,
//             });
//         }
//     }

//     return checkpoints;


// }






export interface Checkpoint {
    title: string;
    amount: number;
    dueOrder: number;
}

export const generateCheckpoints = (
  totalFee: number,
  admissionFee: number,
  // cautionDeposit: number = 0,
  duration: number,
  customCheckpoints: Checkpoint[] = []
): Checkpoint[] => {
  let checkpoints: Checkpoint[] = [];
  let order = 0;
  let remainingFee = totalFee;
  
  

  const validCustom = customCheckpoints.filter(
    (cp) => cp.title.trim() !== "" && cp.amount > 0
  );

  const hasAdmission = validCustom.some(
    (cp) => cp.title.toLowerCase() === "admission fee"
  );


  // Admission fee always first
  if (admissionFee > 0 && !hasAdmission) {
    checkpoints.push({
      title: "Admission Fee",
      amount: admissionFee,
      dueOrder: order++,
    });
    remainingFee -= admissionFee;

  }


  // If custom plan provided
  if (validCustom.length > 0) {
    return [
      ...checkpoints,
      ...validCustom.map((cp, i) => ({
        ...cp,
        // dueOrder: i+ 1,
        dueOrder: order + i,
      })),
    ];
  }

  // Remaining installments
  const installmentCount = duration ;
  // const installmentCount = duration - checkpoints.length;
  if (installmentCount > 0 && remainingFee > 0) {
    const installmentAmount = Math.floor(remainingFee / installmentCount);
    const lastInstallment = installmentAmount + (remainingFee % installmentCount);

    for (let i = 1; i <= installmentCount; i++) {
      checkpoints.push({
        title: `Installment ${i}`,
        amount: i === installmentCount ? lastInstallment : installmentAmount,
        // dueOrder: i+1,
        dueOrder: order++,
      });
    }
  }

  return checkpoints;
};



