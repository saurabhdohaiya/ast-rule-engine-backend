import { ASTNode, OperandValue } from "../interfaces/interfaces"; // Import ASTNode interface

// Function to parse individual conditions from tokens
const parseCondition = (token: string): ASTNode => {
    // Updated regex to match conditions correctly
    const regex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(==|=|!=|>|<|>=|<=)\s*(('[^']*')|("[^"]*")|([0-9]+))$/;
    const match = regex.exec(token);

    if (!match) {
        throw new Error(`Invalid condition format: ${token}`);
    }

    const field = match[1];
    const operator = match[2];
    const value = match[3].replace(/^'|'$/g, '').replace(/^"|"$/g, ''); // Remove quotes from the value

    return {
        type: "operand",
        value: { field, operator, value: isNaN(Number(value)) ? value : Number(value) }
    };
};

// Tokenize the rule string, preserving conditions, operators, and parentheses
const tokenizeRuleString = (ruleString: string): string[] => {
    const tokenPattern = /\s*([()])\s*|\s*(AND|OR)\s*|([a-zA-Z_][a-zA-Z0-9_]*\s*(=|==|!=|>|<|>=|<=)\s*('[^']*'|[0-9]+))\s*/g;

    let tokens: string[] = [];
    let match;

    while ((match = tokenPattern.exec(ruleString)) !== null) {
        if (match[1]) {
            // Parentheses
            tokens.push(match[1]);
        } else if (match[2]) {
            // AND, OR
            tokens.push(match[2]);
        } else if (match[3]) {
            // Full condition like age > 30 or department == 'Sales'
            tokens.push(match[3]);
        }
    }

    return tokens;
};

// Parse rule string into an AST
export const createASTFromRuleString = (ruleString: string): ASTNode => {
    if (!ruleString || typeof ruleString !== 'string') {
        throw new Error('Invalid rule string provided');
    }

    const tokens = tokenizeRuleString(ruleString);
    if (!tokens || tokens.length === 0) {
        throw new Error('Invalid tokenization of rule string');
    }

    const parseExpression = (tokens: string[]): ASTNode => {
        let current: ASTNode | null = null;
        let stack: ASTNode[] = [];

        while (tokens.length > 0) {
            const token = tokens.shift(); // Get the next token

            if (token === undefined) {
                throw new Error("Unexpected end of tokens.");
            }

            if (token === "(") {
                // Start a new sub-expression, recursively parse it
                const subExpression = parseExpression(tokens);
                if (!current) {
                    current = subExpression;
                } else if (current.type === 'operator') {
                    current.right = subExpression;
                }
            } else if (token === ")") {
                // End of the current sub-expression, return current AST node
                return current!;
            } else if (token === "AND" || token === "OR") {
                // Create a new operator node
                if (!current) {
                    throw new Error(`Unexpected logical operator: ${token}`);
                }
                const operatorNode: ASTNode = {
                    type: "operator",
                    value: { field: token, operator: "", value: "" },
                    left: current,
                    right: null
                };
                current = operatorNode;
            } else {
                // Parse the condition into an operand node
                const conditionNode = parseCondition(token);
                if (!current) {
                    current = conditionNode;
                } else if (current.type === 'operator' && !current.right) {
                    current.right = conditionNode;
                }
            }
        }

        return current!;
    };

    const root = parseExpression(tokens);

    if (!root) {
        throw new Error("Invalid rule string, unable to create AST.");
    }
    return root as ASTNode;
};

// Function to combine multiple rule strings into a single AST
export const combineASTFromRuleStrings = (ruleStrings: string[], operator: "AND" | "OR" = "AND"): ASTNode => {
    if (ruleStrings.length === 0) {
        throw new Error('No rules provided for combination.');
    }

    // Use createASTFromRuleString to generate AST for each rule string
    const asts = ruleStrings.map(ruleString => createASTFromRuleString(ruleString));

    // If there's only one rule, return its AST directly
    if (asts.length === 1) {
        return asts[0];
    }

    // Combine the ASTs into a single AST using the specified operator
    let combinedAST: ASTNode = asts[0];

    for (let i = 1; i < asts.length; i++) {
        // Create a new operator node that combines the current combined AST with the next one
        combinedAST = {
            type: "operator",
            value: {
                field: operator,
                operator: "",
                value: ""
            },
            left: combinedAST,
            right: asts[i]
        };
    }

    return combinedAST;
};

// Evaluate AST against provided data
export const evaluateASTFromJSON = (ast: ASTNode, data: Record<string, any>): boolean => {
    if (!ast || !data) {
        throw new Error("Invalid AST or data provided");
    }

    if (!ast.value) {
        throw new Error("Operator value is undefined");
    }

    switch (ast.type) {
        case "operand":
            return evaluateCondition(ast.value, data);
        case "operator":
            return evaluateOperator(ast, data);
        default:
            throw new Error("Unknown AST node type");
    }
};

// Helper function to evaluate conditions
const evaluateCondition = (condition: OperandValue, data: Record<string, any>): boolean => {
    const { field, operator, value } = condition;
    const attributeValue = data[field];

    if (attributeValue === undefined) {
        throw new Error(`Field '${field}' is not present in data.`);
    }

    switch (operator) {
        case ">":
            return attributeValue > value;
        case "<":
            return attributeValue < value;
        case "==":
        case "=":
            return attributeValue == value;
        case "!=":
            return attributeValue != value;
        case ">=":
            return attributeValue >= value;
        case "<=":
            return attributeValue <= value;
        default:
            throw new Error(`Unknown operator: ${operator}`);
    }
};

const evaluateOperator = (node: ASTNode, data: Record<string, any>): boolean => {
    if (!node.value) {
        throw new Error("Operator value is undefined");
    }

    const leftValue = evaluateASTFromJSON(node.left!, data);
    const rightValue = evaluateASTFromJSON(node.right!, data);

    switch (node.value.field) {
        case "AND":
            return leftValue && rightValue;
        case "OR":
            return leftValue || rightValue;
        default:
            throw new Error(`Unknown operator: ${node.value.field}`);
    }
};
