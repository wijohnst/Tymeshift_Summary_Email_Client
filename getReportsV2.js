function sendToDrive(){
  
  const emailAttachments = getEmailAttachments().flat();
  const names = emailAttachments.map(attachment => attachment.getName());

  if(emailAttachments && emailAttachments.length > 0){

    emailAttachments.map((attachment,index) => {

      const reportType = getReportType(parseName(names[index]));
      const file = attachment.copyBlob();
      const folder = DriveApp.getFolderById('1mPmevvful7jgIbBLJ1AT7fwX0e2X0FKS');
      const newReport = folder.createFile(file);

      newReport.setName(`${reportType}.csv`);   
    })
    Data_puller.confirmReportsLoaded();
  }
  else{
    Data_puller.handleErrors({type: 'alert', errorText: `No emails found under the Tymeshift Reports label in your Gmail inbox. Combine all three reports together in an email, send it to yourself, then label it 'Tymeshift Reports', then try this again.`})
  }
}

function getEmailAttachments(){
 
 const gmailLabel = GmailApp.getUserLabelByName('TymeShift Reports');
 const tsReportThreads = gmailLabel.getThreads();
 const tsReportMessages = tsReportThreads.map(thread => thread.getMessages());
 const attachments = tsReportMessages.map(message => message[0].getAttachments());

 tsReportThreads.map(thread => removeLabel(thread, gmailLabel));
 return attachments;
 
}

function parseName(attachmentName){
  console.log(attachmentName);
  const splitSubject = attachmentName.split('_');
  const startString = `${splitSubject[5]}/${splitSubject[6]}/${splitSubject[7]}:${splitSubject[8]}`;
  console.log(startString);
  const endString = `${splitSubject[10]}/${splitSubject[11]}/${splitSubject[12]}:${splitSubject[13]}`;
  return {
    reportStart: new Date(startString),
    reportEnd : new Date(endString)
  }
}

function getReportType({reportStart, reportEnd}){
  const duration = Math.floor((reportEnd.getTime() - reportStart.getTime()) / (1000*60*60*24));
  const startMonth = reportStart.getMonth();
  const endMonth = reportEnd.getMonth();
  console.log(duration);
  if(duration <= 8){
    return '7 day'
  }else if(duration > 8 && startMonth === endMonth){
    return 'm2d'
  }else if(duration > 8 && startMonth !== endMonth){
    return '30 day'
  }
  else{
    console.error(`Can't determine report type. ERROR TRACE: startMonth: ${startMonth}, endMonth: ${endMonth}, duration: ${duration}`);
  }
}

function removeLabel(thread,label){
  console.log(thread.getMessages().map(message => console.log(message.getSubject())));
  thread.removeLabel(label);
}
