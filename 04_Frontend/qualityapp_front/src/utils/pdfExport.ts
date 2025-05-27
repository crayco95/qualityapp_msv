import { jsPDF } from 'jspdf';

// Function to generate a PDF for parameter evaluation results
export const generateParameterEvaluationPdf = (
  evaluationData: any,
  parameterData: any,
  subcategoriesResults: any[]
) => {
  const doc = new jsPDF();
  
  // Set up document properties
  doc.setProperties({
    title: `Parameter Evaluation - ${parameterData.name}`,
    subject: 'Software Quality Evaluation',
    author: 'Software Quality Evaluator',
    creator: 'Software Quality Evaluator'
  });
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(60, 60, 60);
  doc.text('Software Quality Evaluation', 105, 20, { align: 'center' });
  
  // Add parameter information
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(`Parameter: ${parameterData.name}`, 20, 40);
  
  // Add software and evaluation information
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(`Software: ${evaluationData.software.name}`, 20, 50);
  doc.text(`Evaluation Date: ${new Date(evaluationData.createdAt).toLocaleDateString()}`, 20, 60);
  
  // Add subcategories results
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('Subcategories Evaluation Results', 20, 80);
  
  // Table header
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Subcategory', 20, 90);
  doc.text('Score', 120, 90);
  doc.text('Max Score', 140, 90);
  doc.text('Comments', 170, 90);
  
  // Draw header line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 92, 190, 92);
  
  // Draw subcategories table
  let yPos = 100;
  subcategoriesResults.forEach((result, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
      
      // Add header to new page
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text('Subcategory', 20, yPos);
      doc.text('Score', 120, yPos);
      doc.text('Max Score', 140, yPos);
      doc.text('Comments', 170, yPos);
      
      // Draw header line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos + 2, 190, yPos + 2);
      
      yPos += 10;
    }
    
    doc.setTextColor(80, 80, 80);
    doc.text(result.subcategory.name, 20, yPos);
    doc.text(result.score.toString(), 120, yPos);
    doc.text(result.subcategory.maxScore.toString(), 140, yPos);
    
    // Handle comments with potential wrapping
    const comments = result.comments || 'N/A';
    const wrappedComments = doc.splitTextToSize(comments, 40);
    doc.text(wrappedComments, 170, yPos);
    
    // Calculate the height needed for the comments
    const commentLines = wrappedComments.length;
    const lineHeight = 5;
    const rowHeight = Math.max(lineHeight, commentLines * lineHeight);
    
    // Draw row line
    yPos += rowHeight;
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 5;
  });
  
  // Add summary
  const totalScore = subcategoriesResults.reduce((sum, item) => sum + item.score, 0);
  const maxPossibleScore = subcategoriesResults.reduce(
    (sum, item) => sum + item.subcategory.maxScore, 0
  );
  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  
  yPos += 10;
  
  // Check if we need a new page for summary
  if (yPos > 270) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('Summary', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`Total Score: ${totalScore} / ${maxPossibleScore} (${percentage}%)`, 20, yPos);
  
  // Add rating based on percentage
  yPos += 10;
  let rating;
  if (percentage >= 90) {
    rating = 'Excellent';
  } else if (percentage >= 75) {
    rating = 'Good';
  } else if (percentage >= 60) {
    rating = 'Satisfactory';
  } else if (percentage >= 40) {
    rating = 'Needs Improvement';
  } else {
    rating = 'Poor';
  }
  
  doc.text(`Rating: ${rating}`, 20, yPos);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Software Quality Evaluator - Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  return doc;
};

// Function to generate a PDF for the general evaluation results
export const generateGeneralEvaluationPdf = (
  evaluationData: any,
  parametersResults: any[]
) => {
  const doc = new jsPDF();
  
  // Set up document properties
  doc.setProperties({
    title: `Software Quality Evaluation - ${evaluationData.software.name}`,
    subject: 'Software Quality Evaluation',
    author: 'Software Quality Evaluator',
    creator: 'Software Quality Evaluator'
  });
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(60, 60, 60);
  doc.text('Software Quality Evaluation Report', 105, 20, { align: 'center' });
  
  // Add software information
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(`Software: ${evaluationData.software.name}`, 20, 40);
  
  // Add evaluation information
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(`Evaluation Date: ${new Date(evaluationData.createdAt).toLocaleDateString()}`, 20, 50);
  doc.text(`Evaluation ID: ${evaluationData.id}`, 20, 60);
  doc.text(`Standard: ${evaluationData.standard.name}`, 20, 70);
  
  // Add parameters results
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('Parameters Evaluation Results', 20, 90);
  
  // Table header
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Parameter', 20, 100);
  doc.text('Score', 120, 100);
  doc.text('Max Score', 140, 100);
  doc.text('Percentage', 170, 100);
  
  // Draw header line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 102, 190, 102);
  
  // Draw parameters table
  let yPos = 110;
  parametersResults.forEach((result, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
      
      // Add header to new page
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text('Parameter', 20, yPos);
      doc.text('Score', 120, yPos);
      doc.text('Max Score', 140, yPos);
      doc.text('Percentage', 170, yPos);
      
      // Draw header line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos + 2, 190, yPos + 2);
      
      yPos += 10;
    }
    
    const percentage = result.maxScore > 0 
      ? Math.round((result.score / result.maxScore) * 100) 
      : 0;
    
    doc.setTextColor(80, 80, 80);
    doc.text(result.parameter.name, 20, yPos);
    doc.text(result.score.toString(), 120, yPos);
    doc.text(result.maxScore.toString(), 140, yPos);
    doc.text(`${percentage}%`, 170, yPos);
    
    // Draw row line
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 10;
  });
  
  // Add summary
  const totalScore = parametersResults.reduce((sum, item) => sum + item.score, 0);
  const maxPossibleScore = parametersResults.reduce((sum, item) => sum + item.maxScore, 0);
  const overallPercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0;
  
  yPos += 10;
  
  // Check if we need a new page for summary
  if (yPos > 270) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('Overall Evaluation Summary', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(12);
  doc.text(`Total Score: ${totalScore} / ${maxPossibleScore} (${overallPercentage}%)`, 20, yPos);
  
  // Add rating based on percentage
  yPos += 10;
  let rating;
  if (overallPercentage >= 90) {
    rating = 'Excellent';
  } else if (overallPercentage >= 75) {
    rating = 'Good';
  } else if (overallPercentage >= 60) {
    rating = 'Satisfactory';
  } else if (overallPercentage >= 40) {
    rating = 'Needs Improvement';
  } else {
    rating = 'Poor';
  }
  
  doc.text(`Overall Rating: ${rating}`, 20, yPos);
  
  // Add evaluation summary and recommendations
  yPos += 20;
  
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(14);
  doc.text('Recommendations', 20, yPos);
  
  yPos += 10;
  
  doc.setFontSize(10);
  let recommendations = 'No specific recommendations provided.';
  if (evaluationData.recommendations) {
    recommendations = evaluationData.recommendations;
  } else {
    // Generate generic recommendations based on score
    if (overallPercentage < 60) {
      recommendations = 'The software needs significant improvements in multiple areas. Consider reviewing all parameters with low scores and prioritize addressing critical issues.';
    } else if (overallPercentage < 75) {
      recommendations = 'The software meets basic quality standards but could benefit from targeted improvements in specific areas. Focus on parameters with scores below 70%.';
    } else if (overallPercentage < 90) {
      recommendations = 'The software demonstrates good quality overall. Consider fine-tuning aspects with the lowest scores to achieve excellence.';
    } else {
      recommendations = 'The software demonstrates excellent quality across all evaluated parameters. Continue maintaining high standards and consider periodic reviews to ensure continued excellence.';
    }
  }
  
  const wrappedRecommendations = doc.splitTextToSize(recommendations, 170);
  doc.text(wrappedRecommendations, 20, yPos);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Software Quality Evaluator - Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  return doc;
};