const { Import, Listener, Subject, QueueGroupName } = require("test_swe_common")
const Notification = Import("Notification", "notifier")

// CHILDREN CLASS
class BatchUploadedList extends Listener {
  subject = Subject.BATCH_UPLOADER_NOTIFIED
  queueGroupName = QueueGroupName.NOTIFIER_SERVICE

  async onMessage(data, msg) {
    const { batch, message } = data || {}

    // SIMPLE VALIDATION
    if (!batch?._id || !batch?._user) {
      console.error(`[Notifier] invalid payload on ${this.subject}`, data)
      return msg.ack()
    }

    // AVOID DUPLICATES
    const exist = await Notification.findOne({
      _user: batch._user,
      _batch: batch._id,
      type: "BATCH_UPLOADED"
    })

    if (exist) return msg.ack()

    // CREATE NOTIFICATION
    await new Notification({
      _user: batch._user,
      _batch: batch._id,
      type: "BATCH_UPLOADED",
      message: message || "BATCH_UPLOADED"
    }).save()

    console.log(`[Notifier] saved notification type=BATCH_UPLOADED user=${batch._user} batch=${batch._id}`)

    return msg.ack()
  }
}

module.exports = BatchUploadedList
