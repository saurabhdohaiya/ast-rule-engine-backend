import { Request, Response } from "express";
import Rule from "../models/Rule";
import { createASTFromRuleString, combineASTFromRuleStrings, evaluateASTFromJSON } from "../services/astService";

export const createRule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rule_string } = req.body;

        if (!rule_string || typeof rule_string !== 'string') {
            res.status(400).json({ error: 'Invalid or missing rule_string' });
            return;
        }

        const ast = createASTFromRuleString(rule_string);
        const rule = new Rule({ ruleName: "New Rule", ast });
        await rule.save();

        res.status(201).json({ message: "Rule created", rule });
    } catch (err: any) {
        if (err.message.includes("Invalid rule string")) {
            res.status(400).json({ error: 'Invalid rule string format' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const combineRules = async (req: Request, res: Response): Promise<void> => {
    try {
        const { rules, operator } = req.body;

        if (!rules || !Array.isArray(rules) || rules.length === 0) {
            res.status(400).json({ error: 'Invalid or missing rules array' });
            return;
        }

        const combinedAST = combineASTFromRuleStrings(rules, operator || 'AND');
        const combinedRule = new Rule({ ruleName: "Combined Rule", ast: combinedAST });
        await combinedRule.save();

        res.status(201).json({ message: "Rules combined successfully", combinedRule });
    } catch (err: any) {
        if (err.message.includes("No rules provided")) {
            res.status(400).json({ error: 'No rules provided for combination.' });
        } else if (err.message.includes("Invalid rule string")) {
            res.status(400).json({ error: 'One or more rule strings are invalid.' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const evaluateRule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ast, data } = req.body;

        if (!ast || typeof ast !== 'object' || !data || typeof data !== 'object') {
            res.status(400).json({ error: 'Invalid or missing AST or data' });
            return;
        }

        const result = evaluateASTFromJSON(ast, data);
        res.json({ eligible: result });
    } catch (err: any) {
        if (err.message.includes("Invalid AST or data")) {
            res.status(400).json({ error: 'Invalid AST or data provided for evaluation' });
        } else if (err.message.includes("Operator value is undefined")) {
            res.status(400).json({ error: 'Operator value is undefined in AST' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
