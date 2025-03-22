"use client";

import { EventEmitter } from "events";

type NodeType =
  | { type: "start"; id: string; name: string; outputs: string[] }
  | {
      type: "http_request";
      id: string;
      name: string;
      config: HttpRequestConfig;
      outputs: string[];
    }
  | { type: "log"; id: string; name: string; outputs: string[] }
  | {
      type: "terminate";
      id: string;
      name: string;
      config: TerminateConfig;
      outputs: string[];
    }
  | { type: "end"; id: string; name: string; outputs: string[] };

type HttpRequestConfig = {
  method: string;
  url: string;
  headers: Record<string, string>;
};

type TerminateConfig = {
  reason: string;
};

class WorkflowRunner extends EventEmitter {
  private indexedNodes: Record<string, NodeType>;

  constructor(nodes: NodeType[]) {
    super();
    this.indexedNodes = this.indexNodes(nodes);
  }

  private indexNodes(nodes: NodeType[]): Record<string, NodeType> {
    return nodes.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, NodeType>);
  }

  public run(
    entryNodes: NodeType[],
    previousRuns: Record<string, string> = {}
  ): void {
    this.worker(entryNodes, previousRuns);
  }

  private async worker(
    nodes: NodeType[],
    previousRuns: Record<string, string>
  ): Promise<void> {
    for (const node of nodes) {
      this.emit("eval:start", node);

      if (node.type === "http_request") {
        try {
          const response = await fetch(node.config.url, {
            method: node.config.method.toUpperCase(),
            headers: node.config.headers,
          });
          const data = await response.json();
          this.emit(node.id, { ...node, success: data });
        } catch (error) {
          this.emit(node.id, { ...node, fail: error });
        }
      } else if (node.type === "terminate") {
        this.emit(node.id, node);
      } else if (node.type === "log") {
        this.emit(node.id, node);
      } else if (node.type === "end") {
        this.emit(node.id, node);
      } else {
        this.emit(node.id, node);
      }

      const nextNodes = (node.outputs || [])
        .map((output) => {
          const nextNodeId = output.split(":")[1];
          return this.indexedNodes[nextNodeId];
        })
        .filter(Boolean);

      await this.worker(nextNodes, previousRuns);
    }
  }
}

export default WorkflowRunner;
