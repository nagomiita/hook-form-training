import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import {
  serial as polyfill,
  type SerialPort as SerialPortPolyfill,
} from "web-serial-polyfill";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Switch,
} from "@mui/material";
import useMockSerialPort from "./hooks/useMockSerialPort";

const SerialTerminal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [port, setPort] = useState<SerialPortPolyfill | null>(null);
  const [term, setTerm] = useState<Terminal | null>(null);
  const [baudRate, setBaudRate] = useState(115200);
  const [echo, setEcho] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [useMock, setUseMock] = useState(false); // モックモードのトグル

  useMockSerialPort(isConnected && useMock, (data) => {
    if (!term) {
      console.warn("Terminal instance is not initialized.");
      return;
    }
    term.write(data);
  });

  useEffect(() => {
    if (!terminalRef.current) return;

    const terminal = new Terminal({ scrollback: 10000 });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());

    terminal.open(terminalRef.current);
    fitAddon.fit();

    setTerm(terminal);

    return () => {
      terminal.dispose();
    };
  }, []);

  const connectToPort = async () => {
    const serial = navigator.serial || polyfill;
    try {
      const selectedPort = await serial.requestPort({});
      setPort(selectedPort);

      await selectedPort.open({ baudRate });
      setIsConnected(true);
      term?.writeln("Connected to Serial Port!");

      const reader = selectedPort.readable?.getReader();
      const encoder = new TextEncoder();

      term?.onData(async (data) => {
        if (echo) term?.write(data);
        if (selectedPort.writable) {
          const writer = selectedPort.writable.getWriter();
          writer.write(encoder.encode(data));
          writer.releaseLock();
        }
      });

      while (selectedPort.readable) {
        if (!reader) break;
        const { value, done } = await reader.read();
        if (done) break;
        term?.write(value);
      }
    } catch (error) {
      console.error("Error connecting to serial port:", error);
      term?.writeln(`Error: ${(error as Error).message}`);
    }
  };

  const disconnectFromPort = async () => {
    if (port) {
      await port.close();
      setPort(null);
      setIsConnected(false);
      term?.writeln("Disconnected from Serial Port!");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* 設定 UI */}
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Baud Rate"
              type="number"
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              size="small"
              sx={{ width: 150 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={echo}
                  onChange={(e) => setEcho(e.target.checked)}
                />
              }
              label="Echo"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                />
              }
              label="Use Mock Data"
            />
          </Box>

          {/* ターミナル */}
          <Box
            ref={terminalRef}
            sx={{
              height: 300,
              border: "1px solid #ccc",
              borderRadius: 2,
              bgcolor: "black",
              padding: 1,
            }}
          />

          {/* ボタン群 */}
          <Box display="flex" justifyContent="space-between">
            {!isConnected ? (
              <Button variant="contained" onClick={connectToPort}>
                Connect
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={disconnectFromPort}
              >
                Disconnect
              </Button>
            )}
            <Button variant="outlined" onClick={() => term?.clear()}>
              Clear Terminal
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SerialTerminal;
