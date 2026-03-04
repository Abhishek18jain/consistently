export const keepBackendAlive = () => {
  const url = process.env.REACT_APP_API_URL + "/health";

  const ping = async () => {
    try {
      await fetch(url);
      console.log("Backend pinged");
    } catch (err) {
      console.error("Ping failed");
    }
  };

  ping();

  setInterval(ping, 10 * 60 * 1000); // every 10 minutes
};