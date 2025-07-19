"use client";
import { useQuery, DocumentNode } from "@apollo/client";

type UseGraphQLResult<T = any> = {
  loading: boolean;
  error?: Error;
  data?: T;
};

export default function fetch<T = any>(
  query: DocumentNode,
  variables: Record<string, any> = {}
): UseGraphQLResult<T> {
  const { data, loading, error } = useQuery<T>(query, { variables });
  return { data, loading, error };
}
