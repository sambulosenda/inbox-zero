"use client";

import { LabelsResponse } from "@/app/api/google/labels/route";
import { createContext, useContext, useMemo } from "react";
import useSWR from "swr";

type Label = {
  id: string;
  name: string;
  type?: string | null;
  color?: {
    textColor?: string | null;
    backgroundColor?: string | null;
  };
};

export type GmailLabels = Record<string, Label>;

interface Context {
  labels?: GmailLabels;
  labelsIsLoading: boolean;
}

const GmailContext = createContext<Context>({
  labels: {},
  labelsIsLoading: false,
});

export const useGmail = () => useContext<Context>(GmailContext);

export function GmailProvider(props: { children: React.ReactNode }) {
  const { data, isLoading } = useSWR<LabelsResponse>("/api/google/labels");

  const labels = useMemo(() => {
    return data?.labels?.reduce((acc, label) => {
      if (label.id && label.name) {
        acc[label.id] = {
          id: label.id,
          name: label.name,
          type: label.type,
          color: label.color,
        };
      }
      return acc;
    }, {} as GmailLabels);
  }, [data]);

  return (
    <GmailContext.Provider value={{ labels, labelsIsLoading: isLoading }}>
      {props.children}
    </GmailContext.Provider>
  );
}
