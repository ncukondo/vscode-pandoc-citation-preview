export interface ResolveContext {
  mdFileDir: string;
  searchDirectories: string[];
  workspaceRoot: string;
  exists: (path: string) => boolean | Promise<boolean>;
}

function isAbsolute(filePath: string): boolean {
  return filePath.startsWith("/");
}

function joinPath(dir: string, relative: string): string {
  const segments = dir.replace(/\/+$/, "").split("/");
  for (const part of relative.split("/")) {
    if (part === "..") {
      segments.pop();
    } else if (part !== "." && part !== "") {
      segments.push(part);
    }
  }
  return segments.join("/");
}

export function resolvePath(
  filePath: string,
  context: ResolveContext,
): string | null {
  // Absolute path: return as-is if it exists
  if (isAbsolute(filePath)) {
    return context.exists(filePath) ? filePath : null;
  }

  return null;
}
