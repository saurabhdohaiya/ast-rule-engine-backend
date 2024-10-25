export interface OperandValue {
    field: string;
    operator: string;
    value: number | string;
  }
  
  export interface ASTNode {
    type: "operator" | "operand";
    left?: ASTNode | null;
    right?: ASTNode | null;
    value?: OperandValue;
  }
  
  export interface RuleDocument extends Document {
    ruleName: string;
    ast: ASTNode;
    createdAt: Date;
  }
  