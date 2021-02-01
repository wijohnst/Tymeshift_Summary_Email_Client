function testRemoveLabel(){
  const gmailLabel = GmailApp.getUserLabelByName('Test');
  const threads = gmailLabel.getThreads();
  (threads ? threads.map(thread => removeLabel(thread, gmailLabel)) : console.log('No threads...'));
}

function removeLabel(thread,label){
  console.log(thread.getMessages().map(message => console.log(message.getSubject())));
  thread.removeLabel(label);
}