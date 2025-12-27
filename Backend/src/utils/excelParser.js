
const XLSX = require('xlsx');

class ExcelParser {

    //   Parse MCQ format Excel file
    //   Format: num | question | option A | option B | option C | option D | correct answer

    static parseMCQFormat(fileBuffer) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // Remove header row
        const rows = data.slice(1);

        const questions = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Skip empty rows
            if (!row[0] && !row[1]) continue;

            const num = row[0];
            const questionText = row[1];
            const optionA = row[2];
            const optionB = row[3];
            const optionC = row[4];
            const optionD = row[5];
            const correctAnswer = row[6]; // Should be 'A', 'B', 'C', or 'D'

            // Validate required fields
            if (!questionText || !optionA) {
                throw new Error(`Row ${i + 2}: Missing question text or options`);
            }

            // Validate correct answer
            const validAnswers = ['A', 'B', 'C', 'D'];
            if (!correctAnswer || !validAnswers.includes(correctAnswer.toUpperCase().trim())) {
                throw new Error(`Row ${i + 2}: Invalid correct answer. Must be A, B, C, or D`);
            }

            // Build possible answers array
            const possibleAnswers = [];
            const options = [
                { letter: 'A', text: optionA },
                { letter: 'B', text: optionB },
                { letter: 'C', text: optionC },
                { letter: 'D', text: optionD }
            ];

            options.forEach((option, index) => {
                if (option.text && option.text.toString().trim()) {
                    possibleAnswers.push({
                        answerText: option.text.toString().trim(),
                        isCorrect: option.letter === correctAnswer.toUpperCase().trim(),
                        orderIndex: index
                    });
                }
            });

            if (possibleAnswers.length < 2) {
                throw new Error(`Row ${i + 2}: At least 2 options required for MCQ`);
            }

            questions.push({
                rowNumber: i + 2,
                num: num,
                questionText: questionText.toString().trim(),
                type: 'MCQ',
                possibleAnswers: possibleAnswers
            });
        }

        return questions;
    }


    //   Parse Open-ended format Excel file
    //   Format: num | question | answer

    static parseOpenFormat(fileBuffer) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

        // Remove header row
        const rows = data.slice(1);

        const questions = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Skip empty rows
            if (!row[0] && !row[1]) continue;

            const num = row[0];
            const questionText = row[1];
            const answer = row[2]; // Sample/expected answer (optional for open questions)

            // Validate required fields
            if (!questionText) {
                throw new Error(`Row ${i + 2}: Missing question text`);
            }

            questions.push({
                rowNumber: i + 2,
                num: num,
                questionText: questionText.toString().trim(),
                type: 'Open',
                sampleAnswer: answer ? answer.toString().trim() : null
            });
        }

        return questions;
    }

    //
    //   Detect format based on column count and headers
    //
    static detectFormat(fileBuffer) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!data || data.length < 2) {
            throw new Error('Excel file is empty or has no data rows');
        }

        const headerRow = data[0];
        const columnCount = headerRow.filter(cell => cell !== undefined && cell !== '').length;

        // MCQ format should have 6-7 columns (num, question, optionA-D, correct answer)
        // Open format should have 2-3 columns (num, question, answer)

        if (columnCount >= 6) {
            return 'MCQ';
        } else if (columnCount >= 2 && columnCount <= 3) {
            return 'Open';
        } else {
            throw new Error('Unable to detect format. Expected MCQ (6-7 columns) or Open (2-3 columns)');
        }
    }


    //  Auto-parse based on detected format

    static parseAuto(fileBuffer) {
        const format = this.detectFormat(fileBuffer);

        if (format === 'MCQ') {
            return {
                format: 'MCQ',
                questions: this.parseMCQFormat(fileBuffer)
            };
        } else {
            return {
                format: 'Open',
                questions: this.parseOpenFormat(fileBuffer)
            };
        }
    }
}

module.exports = ExcelParser;