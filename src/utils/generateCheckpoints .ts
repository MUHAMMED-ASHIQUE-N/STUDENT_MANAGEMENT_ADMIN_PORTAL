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
    console.log(remainingFee,'remening fee first totalfee amount in generate checkpoint');


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
      console.log(remainingFee,'remening amount after minus admission in generate checkpoint');

  }

  if (validCustom.length > 0) {
    return [
      ...checkpoints,
      ...validCustom.map((cp, i) => ({
        ...cp,
        dueOrder: order + i,
        dueDate: Timestamp.fromDate(
          new Date(jsStartDate.getTime() + (order + i) * 30 * 24 * 60 * 60 * 1000),
        ),
      })),
    ];
  }

  const installmentCount = Number(duration);
  if (installmentCount > 0 && remainingFee > 0) {
    const baseAmount = Math.floor(remainingFee / installmentCount);
    console.log(baseAmount, 'base amount in //////');
    
    const remainder = remainingFee % installmentCount;
  console.log(remainder,'remening amount in generate checkpoint');
  console.log(installmentCount, 'installment count');
  

    for (let i = 1; i <= installmentCount; i++) {
      let amount = baseAmount;
      console.log(amount, 'amount before if loop');
      
      if (i === installmentCount) {
        amount = Number(amount) + Number(remainder);
        console.log(amount,'amount in get with reminder in for loop i== installment count');
        
        
      }
      console.log(amount, 'amount after set remining fee also');
      checkpoints.push({
        title: `Installment ${i}`,
        amount,
        dueOrder: order++,
        dueDate: Timestamp.fromDate(
          new Date(jsStartDate.getTime() + (order - 1) * 30 * 24 * 60 * 60 * 1000),
        ),
      });
      console.log(checkpoints, 'last checkpoiotn');
      
    }
  }

  return checkpoints;
};