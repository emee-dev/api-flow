"use client";

import type React from "react";

import { useState } from "react";
import {
  Play,
  Terminal,
  Globe,
  Square,
  ChevronRight,
  ChevronDown,
  Code,
  Database,
  FileJson,
  Workflow,
} from "lucide-react";

interface NodeTypeItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: "start",
    label: "Start",
    icon: <Play className="h-4 w-4" />,
    description: "Starting point of the flow",
  },
  {
    type: "end",
    label: "End",
    icon: <Square className="h-4 w-4" />,
    description: "Ending point of the flow",
  },
  {
    type: "httpRequest",
    label: "HTTP Request",
    icon: <Globe className="h-4 w-4" />,
    description: "Make HTTP requests",
  },
  {
    type: "consoleLog",
    label: "Console Log",
    icon: <Terminal className="h-4 w-4" />,
    description: "Log output to console",
  },
  // {
  //   type: "script",
  //   label: "Script",
  //   icon: <Code className="h-4 w-4" />,
  //   description: "Run JavaScript code",
  // },
];

export function NodePalette() {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    "Flow Control": true,
    Actions: true,
    Data: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r bg-white overflow-y-auto">
      <div className="p-4">
        <h2 className="font-medium mb-4">Node Palette</h2>

        {/* Flow Control Category */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between cursor-pointer mb-2"
            onClick={() => toggleCategory("Flow Control")}
          >
            <h3 className="text-sm font-medium">Flow Control</h3>
            {expandedCategories["Flow Control"] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {expandedCategories["Flow Control"] && (
            <div className="space-y-2">
              {nodeTypes.slice(0, 2).map((node) => (
                <div
                  key={node.type}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-grab"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                >
                  <div className="mr-2 text-gray-500">{node.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{node.label}</div>
                    <div className="text-xs text-gray-500">
                      {node.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Category */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between cursor-pointer mb-2"
            onClick={() => toggleCategory("Actions")}
          >
            <h3 className="text-sm font-medium">Actions</h3>
            {expandedCategories["Actions"] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {expandedCategories["Actions"] && (
            <div className="space-y-2">
              {nodeTypes.slice(2, 5).map((node) => (
                <div
                  key={node.type}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-grab"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                >
                  <div className="mr-2 text-gray-500">{node.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{node.label}</div>
                    <div className="text-xs text-gray-500">
                      {node.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Category */}
        <div className="mb-4">
          <div
            className="flex items-center justify-between cursor-pointer mb-2"
            onClick={() => toggleCategory("Data")}
          >
            <h3 className="text-sm font-medium">Data</h3>
            {expandedCategories["Data"] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {expandedCategories["Data"] && (
            <div className="space-y-2">
              {nodeTypes.slice(5).map((node) => (
                <div
                  key={node.type}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-grab"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                >
                  <div className="mr-2 text-gray-500">{node.icon}</div>
                  <div>
                    <div className="text-sm font-medium">{node.label}</div>
                    <div className="text-xs text-gray-500">
                      {node.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
