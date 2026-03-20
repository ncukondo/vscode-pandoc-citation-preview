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

  // Relative path: resolve from markdown file directory
  const fromMdDir = joinPath(context.mdFileDir, filePath);
  if (context.exists(fromMdDir)) {
    return fromMdDir;
  }

  // Fallback: search directories in order
  for (const dir of context.searchDirectories) {
    const candidate = joinPath(dir, filePath);
    if (context.exists(candidate)) {
      return candidate;
    }
  }

  // Fallback: workspace root
  const fromRoot = joinPath(context.workspaceRoot, filePath);
  if (context.exists(fromRoot)) {
    return fromRoot;
  }

  return null;
}

export function resolveDefaultBibliography(
  defaultPaths: string[],
  context: ResolveContext,
): string[] {
  const resolved: string[] = [];
  for (const p of defaultPaths) {
    const result = resolvePath(p, context);
    if (result !== null) {
      resolved.push(result);
    }
  }
  return resolved;
}
