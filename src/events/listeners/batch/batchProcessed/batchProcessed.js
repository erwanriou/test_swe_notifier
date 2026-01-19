const { Import, Listener, Subject, QueueGroupName } = require("test_swe_common")
const Notification = Import("Notification", "notifier")

// CHILDREN CLASS
class BatchProcessedList extends Listener {
  subject = Subject.BATCH_SCHEDULER_NOTIFIED
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
      type: "BATCH_PROCESSED"
    })

    if (exist) return msg.ack()

    // CREATE NOTIFICATION
    await new Notification({
      _user: batch._user,
      _batch: batch._id,
      type: "BATCH_PROCESSED",
      message: message || "BATCH_PROCESSED"
    }).save()

    console.log(`[Notifier] saved notification type=BATCH_PROCESSED user=${batch._user} batch=${batch._id}`)

    return msg.ack()
  }
}

module.exports = BatchProcessedList
