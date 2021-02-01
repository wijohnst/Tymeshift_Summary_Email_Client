/*
enum ReportType {
  7 day = "7 day",
  30 day = "30 day"
  m2d = "m2d"
}

Interface Report {
  url: string,
  title: enum ReportType
}
 */
async function sendEmailReportsToDrive(){

  const [subjects, urls] = getTymeshiftReports();
  
  // reports : <Array : Report>
  const reports = urls.map((url, index) => ({
    url: url,
    title: getReportType(parseEmailSubject(subjects[index]))
  }))

  //Fetch report using url in reports[i]

  fetchFileFromUrl(reports[1].url);
  

}

function getTymeshiftReports(){
 const gmailLabel = GmailApp.getUserLabelByName('TymeShift Reports');
 const tsReportThreads = gmailLabel.getThreads();
 const tsReportMessages = tsReportThreads.map(thread => thread.getMessages());
 const urls = tsReportMessages.map(message => parseMessageBody(message[0].getBody()));
 const subjects = tsReportMessages.map(message => message[0].getSubject());

 return [subjects,urls]; 
}

function parseEmailSubject(tsEmailSubject){

  const splitSubject = tsEmailSubject.split('_');
 
  return {
    reportStart: new Date(splitSubject[5]),
    reportEnd : new Date(splitSubject[7])
  }
}

function getReportType({reportStart, reportEnd}){
  const duration = Math.floor((reportEnd.getTime() - reportStart.getTime()) / (1000*60*60*24));
  const startMonth = reportStart.getMonth();
  const endMonth = reportEnd.getMonth();
  
  if(duration <= 7){
    return '7 day'
  }else if(duration > 7 && startMonth === endMonth){
    return 'm2d'
  }else if(duration > 7 && startMonth !== endMonth){
    return '30 day'
  }
  else{
    console.error(`Can't determine report type. ERROR TRACE: startMonth: ${startMonth}, endMonth: ${endMonth}, duration: ${duration}`);
  }
}

function parseMessageBody(messageBody){
  return messageBody.split(`"`)[1];
}

function fetchFileFromUrl(url){

var token = ScriptApp.getOAuthToken();

var headersOptions = { 
  Authorization : 'Bearer ' + token
  };

var options = { 
  headers : headersOptions
  };

  try{
    const response = UrlFetchApp.fetch(url,options);
    file = response.getBlob();
    // const file = response.getAllHeaders();
    // console.log(file);
    const folder = DriveApp.getFolderById('1mPmevvful7jgIbBLJ1AT7fwX0e2X0FKS');
    folder.createFile(file);
    console.log('FILE CREATED...')
  }catch(error)
  {
    debugger;
  }
}

