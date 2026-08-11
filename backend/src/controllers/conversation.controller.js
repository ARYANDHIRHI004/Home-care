import Conversation from "../models/conversation.model.js";
import Customer from "../models/customer.model.js";

export const createConversation = async (req, res) => {
  try {
    res.status(201).json(await Conversation.create(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.channel) filter.channel = req.query.channel;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customerId) filter.customerId = req.query.customerId;

    res.json(
      await Conversation.find(filter)
        .populate("customerId", "name phone")
        .populate("linkedEnquiryId")
        .sort({ updatedAt: -1 })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate("customerId")
      .populate("linkedEnquiryId");

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const { from, text } = req.body;
    if (!from || !text)
      return res.status(400).json({ message: "from and text are required" });

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { messages: { from, text, timestamp: new Date() } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const linkCustomerByPhone = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = await Customer.create({
        name,
        phone,
        email,
        otpVerified: false,
        registrationChannel: "whatsapp",
      });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id, { customerId: customer._id }, { new: true }
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json({ conversation, customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateConversationStatus = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: new Date() },
      { new: true }
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
