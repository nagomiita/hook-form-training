import { useState, useEffect } from "react";

const useMockSerialPort = (
  isConnected: boolean,
  onDataReceived: (data: string) => void
) => {
  const [mockPort, setMockPort] = useState<boolean>(false);

  useEffect(() => {
    if (!isConnected) {
      setMockPort(false);
      return;
    }

    setMockPort(true);

    // 定期的にモックデータを送信する
    const interval = setInterval(() => {
      const mockData = `Mock Data: ${new Date().toLocaleTimeString()}\n`;
      onDataReceived(mockData);
    }, 2000); // 2秒ごとにデータ送信

    return () => clearInterval(interval);
  }, [isConnected, onDataReceived]);

  return {
    isMockConnected: mockPort,
  };
};

export default useMockSerialPort;
