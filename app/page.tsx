"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Save } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type NodeProps,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import WorkflowRunner from "./runner";

// Node types
const nodeTypes = {
  start: StartNode,
  http_request: HttpRequestNode,
  log: LogNode,
  terminate: TerminateNode,
  end: EndNode,
};

const initialWorkflow = [
  {
    type: "start",
    id: "start",
    name: "Start",
    outputs: ["start:http_request"],
  },
  {
    type: "http_request",
    id: "http_request",
    name: "Http Request",
    config: {
      headers: {
        Accept: "application/json",
      },
      method: "get",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    },
    outputs: ["http_request:log"],
  },
  { type: "log", id: "log", name: "Log", outputs: ["log:terminate"] },
  {
    type: "terminate",
    id: "terminate",
    name: "Stop Workflow",
    config: { reason: "End of flow." },
    outputs: [],
  },
  { type: "end", id: "end", name: "End", outputs: [] },
];

// Convert workflow to ReactFlow nodes
function workflowToNodes(workflow: any) {
  return workflow.map((node: any, index: any) => {
    return {
      id: node.id,
      type: node.type,
      data: {
        label: node.name,
        config: node.config || {},
        outputs: node.outputs || [],
      },
      position: { x: 250, y: index * 150 },
    };
  });
}

// Convert workflow to ReactFlow edges
function workflowToEdges(workflow: any) {
  const edges = [] as any[];

  workflow.forEach((node: any) => {
    if (!node.outputs) return;

    if (Array.isArray(node.outputs)) {
      node.outputs.forEach((output: any) => {
        const [source, target] = output.split(":");
        if (source && target && source === node.id) {
          edges.push({
            id: `${source}-${target}`,
            source,
            target,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            animated: true,
          });
        }
      });
    }
  });

  return edges;
}

// Node components
function StartNode({ data, isConnectable }: NodeProps) {
  return (
    <Card className="w-48 bg-green-50 border-green-500">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Handle
          type="source"
          position={Position.Bottom}
          id="out"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
}

function HttpRequestNode({ data, isConnectable }: NodeProps) {
  return (
    <Card className="w-48 bg-purple-50 border-purple-500">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs">
        <div>Method: {data.config?.method}</div>
        <div>URL: {data.config?.url}</div>
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="out"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
}

function LogNode({ data, isConnectable }: NodeProps) {
  return (
    <Card className="w-48 bg-gray-50 border-gray-500">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="out"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
}

function TerminateNode({ data, isConnectable }: NodeProps) {
  return (
    <Card className="w-48 bg-red-50 border-red-500">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs">
        <div>Reason: {data.config?.reason}</div>
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
}

function EndNode({ data, isConnectable }: NodeProps) {
  return (
    <Card className="w-48 bg-green-50 border-green-500">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          isConnectable={isConnectable}
        />
      </CardContent>
    </Card>
  );
}

function WorkflowDesigner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflowToNodes(initialWorkflow)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflowToEdges(initialWorkflow)
  );
  const [nodeType, setNodeType] = useState<string>("log");
  const [nodeName, setNodeName] = useState<string>("");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflowJson, setWorkflowJson] = useState<string>("");

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onAddNode = useCallback(() => {
    if (!nodeName) return;

    const newNodeId = `${nodeType}_${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: nodeType,
      data: {
        label: nodeName,
        config: {},
        outputs: [],
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
  }, [nodeType, nodeName, setNodes]);

  // Generate workflow JSON
  const generateWorkflowJson = useCallback(() => {
    const workflow = nodes.map((node) => {
      // Here we find all edges where this node is the source
      const nodeEdges = edges.filter((edge) => edge.source === node.id);

      // Create outputs array based on edges
      let outputs: any;

      if (node.type === "condition") {
        outputs = { true: [], false: [] };
        nodeEdges.forEach((edge) => {
          const outputKey = edge.sourceHandle === "true" ? "true" : "false";
          outputs[outputKey].push(`${edge.source}:${edge.target}`);
        });
      } else {
        outputs = nodeEdges.map((edge) => `${edge.source}:${edge.target}`);
      }

      return {
        id: node.id,
        type: node.type,
        name: node.data.label,
        config: node.data.config,
        outputs: outputs,
      };
    });

    setWorkflowJson(JSON.stringify(workflow, null, 2));
  }, [nodes, edges]);

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes as NodeTypes}
          fitView
          onInit={setReactFlowInstance as any}
        >
          <Controls />
          {/* @ts-ignore */}
          <Background variant="dots" gap={12} size={1} />

          <Panel
            position="top-right"
            className="bg-white p-4 rounded-md shadow-md"
          >
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Add Node</h3>
              <div className="flex gap-2">
                <Select value={nodeType} onValueChange={setNodeType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Node Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="http_request">HTTP Request</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                    <SelectItem value="terminate">Terminate</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="Node Name"
                  className="px-3 py-2 border rounded-md"
                />
                <Button onClick={onAddNode} size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              <Button
                onClick={generateWorkflowJson}
                className="mt-2"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-1" /> Generate Workflow JSON
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {workflowJson && (
        <div className="h-1/3 border-t p-4 overflow-auto">
          <div className="flex items-center mb-3">
            <h3 className="font-medium mb-2">Workflow JSON</h3>
            <Button
              variant={"default"}
              size={"sm"}
              className="ml-auto"
              onClick={() => {
                const workflowRunner = new WorkflowRunner([
                  {
                    type: "http_request",
                    id: "http_request",
                    name: "Http Request",
                    config: {
                      headers: { Accept: "application/json" },
                      method: "get",
                      url: "https://jsonplaceholder.typicode.com/todos/1",
                    },
                    outputs: ["http_request:log"],
                  },
                  {
                    type: "log",
                    id: "log",
                    name: "Log",
                    outputs: ["log:terminate"],
                  },
                  {
                    type: "terminate",
                    id: "terminate",
                    name: "Stop Workflow",
                    config: { reason: "API Error" },
                    outputs: [],
                  },
                  { type: "end", id: "end", name: "End", outputs: [] },
                ]);
                workflowRunner.on("eval:start", (node) =>
                  console.log(`Starting node: ${node.name}`)
                );
                workflowRunner.on("http_request", (node) => {
                  if (node?.success) {
                    console.log(`Http success: ${node.name}`, node.success);
                  }
                  if (node?.fail) {
                    console.log(`Http fail: ${node.name}`, node.fail);
                  }
                });
                workflowRunner.on("terminate", (node) =>
                  console.log(`Workflow terminated: ${node.config.reason}`)
                );
                workflowRunner.on("end", (node) =>
                  console.log(`Workflow completed.`, node)
                );
                workflowRunner.run([
                  {
                    type: "start",
                    id: "start",
                    name: "Start",
                    outputs: ["start:http_request"],
                  },
                ]);
              }}
            >
              Run demo workflow
            </Button>
          </div>
          <Textarea
            value={workflowJson}
            readOnly
            className="h-full font-mono text-sm bg-neutral-400/70"
          />
        </div>
      )}
    </div>
  );
}

export default function WorkflowDesignerWrapper() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  );
}
