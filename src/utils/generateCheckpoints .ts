


import { Timestamp } from "firebase/firestore";


export interface Checkpoint {
    title: string;
    amount: number;
    dueOrder: number;
    dueDate?: Timestamp;
}

export const generateCheckpoints = (
  totalFee: number,
  admissionFee: number,
  duration: number,
  customCheckpoints: Checkpoint[] = [],
  startDate: Timestamp = Timestamp.fromDate(new Date()),
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

  const jsStartDate = startDate.toDate()
  if (admissionFee > 0 && !hasAdmission) {
    checkpoints.push({
      title: "Admission Fee",
      amount: admissionFee,
      dueOrder: order++,
      dueDate: startDate,
    });
    remainingFee -= admissionFee;

  }

  if (validCustom.length > 0) {
    return [
      ...checkpoints,
      ...validCustom.map((cp, i) => ({
        ...cp,
        dueOrder: order + i,
        dueDate:Timestamp.fromDate(
         new Date(jsStartDate.getTime() + (order + i) * 30 * 24 * 60 * 60 * 1000),
      ),})),
    ];
  }

  const installmentCount = duration ;
  if (installmentCount > 0 && remainingFee > 0) {
    const installmentAmount = Math.floor(remainingFee / installmentCount);
    const lastInstallment = installmentAmount + (remainingFee % installmentCount);

    for (let i = 1; i <= installmentCount; i++) {
      checkpoints.push({
        title: `Installment ${i}`,
        amount: i === installmentCount ? lastInstallment : installmentAmount,
        dueOrder: order++,
        dueDate: Timestamp.fromDate(new Date(jsStartDate.getTime() + (order - 1) * 30 * 24 * 60 * 60 * 1000),),
      });
    }
  }

  return checkpoints;
};

