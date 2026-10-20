import { createContext } from "react";
/** Lets the isolated uncertain-placement preview hide conversation messages that belong only to the real Side Letter record. */
export const PaperPreviewContext = createContext<(active: boolean) => void>(() => {});
/** Chat messages describing the real paper's placement and effect check. */
export const isPaperRecordMessage = (id: string) => id.startsWith("paper-context-") || id.startsWith("paper-filing-");
