import { createOrder } from "@/lib/actions/orders.action";

// Simulated job queue (could be replaced with a more robust solution)
const jobQueue: any[] = [];

export const queueOrderProcessing = async(order: any) => {
  jobQueue.push(order);
  processJobs();
};

const processJobs = async () => {
  while (jobQueue.length > 0) {
    const job = jobQueue.shift();
    try {
      await createOrder(job);
      console.log("Order processed successfully:", job);
    } catch (error) {
      console.error("Error processing order:", error);
    }
  }
};
