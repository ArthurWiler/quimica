export interface CheckResult {
  ok: boolean;
  messages: string[];
  highlight?: number[];
  /** resposta vazia/incompleta: não gasta tentativa */
  semTentativa?: boolean;
}

export interface ExProps<E> {
  ex: E;
  locked: boolean;
  revealed: boolean;
  submit: (r: CheckResult) => void;
}
