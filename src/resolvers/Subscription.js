import { getUserId } from "../utils";

const Subscription = {
  count: {
    subscribe(args, { pubsub }) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count,
        });
      }, 1000);
      return pubsub.asyncIterator("count");
    },
  },
};

export default Subscription;
