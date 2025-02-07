"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, Terminal } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Console() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const terminalRef = useRef<HTMLDivElement>(null)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOutput([...output, `$ ${input}`, `Executed: ${input}`])
    setInput("")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Web Deployment Console
        </h1>
        
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="w-full">
          <div
            ref={terminalRef}
            className="bg-black text-green-400 p-4 rounded-lg h-[60vh] overflow-y-auto font-mono text-sm"
          >
            {output.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-grow bg-background text-foreground border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your command..."
            />
            <Button type="submit" className="rounded-l-none">
              Execute
            </Button>
          </form>
        </div>
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2023 Web Deployment Platform. All rights reserved.
      </footer>
    </div>
  )
}