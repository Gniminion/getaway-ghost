const net = require("net");
const FirebaseServer = require("firebase-server");

const PORT = Number(process.env.FIREBASE_PORT || 9000);

function portInUse(port) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(true))
      .once("listening", () => tester.close(() => resolve(false)))
      .listen(port);
  });
}

async function main() {
  if (await portInUse(PORT)) {
    console.error(`Port ${PORT} is already in use.`);
    console.error(" another emulator is already running; run yarn dev in a second terminal.");
    console.error(` or restart:  yarn firebase:stop && yarn firebase`);
    process.exit(1);
  }

  new FirebaseServer(PORT);
  console.log(`Firebase RTDB emulator: http://localhost:${PORT}`);
  console.log(`Use in .env.local: NEXT_PUBLIC_FIREBASE_EMULATOR_URL=http://localhost:${PORT}/?ns=getaway-ghost`);
}

main();
