import mongoose, { Schema } from "mongoose";
import { RuleDocument, ASTNode } from "../interfaces/interfaces";

const nodeSchema = new Schema<ASTNode>({
  type: { type: String, required: true },
  left: { type: Schema.Types.Mixed, default: null },
  right: { type: Schema.Types.Mixed, default: null },
  value: { type: Schema.Types.Mixed, default: null },
});

const ruleSchema = new Schema<RuleDocument>({
  ruleName: { type: String, required: true },
  ast: { type: nodeSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Rule = mongoose.model<RuleDocument>("Rule", ruleSchema);
export default Rule;
