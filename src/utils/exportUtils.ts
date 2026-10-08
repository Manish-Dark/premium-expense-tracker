import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { Expense } from '../types';

export const exportToExcel = (expenses: Expense[]) => {
    interface ExcelRow {
        Date: string;
        Time: string;
        Application: string;
        Description: string;
        Price: number;
    }
    const data: ExcelRow[] = expenses.map(expense => {
        const dateObj = new Date(expense.date);
        return {
            Date: dateObj.toLocaleDateString(),
            Time: dateObj.toLocaleTimeString(),
            Application: expense.paymentMethod,
            Description: expense.description,
            Price: expense.amount
        };
    });

    // Add total row
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    data.push({
        Date: '',
        Time: '',
        Application: '',
        Description: 'Total',
        Price: totalAmount
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Auto-width columns
    const maxWidths = [
        { wch: 12 }, // Date
        { wch: 12 }, // Time
        { wch: 15 }, // Application
        { wch: 30 }, // Description
        { wch: 10 }  // Price
    ];
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, "ExpenseTracker_Report.xlsx");
};

export const exportToPDF = (expenses: Expense[]) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("ExpenseTracker Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" });

    // Table Data
    const tableData = expenses.map(expense => {
        const dateObj = new Date(expense.date);
        return [
            dateObj.toLocaleDateString(),
            dateObj.toLocaleTimeString(),
            expense.paymentMethod,
            expense.description,
            `Rs. ${expense.amount.toFixed(2)}`
        ];
    });

    // Add total row
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    tableData.push([
        '',
        '',
        '',
        'Total',
        `Rs. ${totalAmount.toFixed(2)}`
    ]);

    autoTable(doc, {
        head: [['Date', 'Time', 'Application', 'Description', 'Price']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo-600 to match theme
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 25 }, // Date
            1: { cellWidth: 25 }, // Time
            2: { cellWidth: 30 }, // Application
            3: { cellWidth: 'auto' }, // Description
            4: { cellWidth: 30, halign: 'right' }  // Price
        }
    });

    doc.save("ExpenseTracker_Report.pdf");
};
