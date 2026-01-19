const { Import, Listener, Subject, QueueGroupName } = require("test_swe_common")
const Notification = Import("Notification", "notifier")

// CHILDREN CLASS
class BatchUploadedList extends Listener {
  subject = Subject.BATCH_UPLOADER_NOTIFIED
  queueGroupName = QueueGroupName.NOTIFIER_SERVICE

  async onMessage(data, msg) {
    return msg.ack()
  }
}

module.exports = BatchUploadedList
