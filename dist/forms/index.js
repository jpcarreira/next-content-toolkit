'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

// src/forms/newsletter-form.tsx
function SuccessMessage({
  title,
  description,
  icon
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center py-8", children: [
    icon ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mx-auto mb-4", children: icon }) : /* @__PURE__ */ jsxRuntime.jsx(
      "svg",
      {
        className: "h-16 w-16 text-[#00E0FF] mx-auto mb-4",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: title }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-slate-300", children: description })
  ] });
}
function NewsletterForm({
  apiEndpoint = "/api/newsletter",
  title = "Stay Updated",
  description = "Get the latest updates directly in your inbox",
  buttonText = "Subscribe",
  successTitle = "Successfully Subscribed!",
  successDescription = "Welcome aboard! You'll receive updates in your inbox.",
  className = "",
  onSuccess,
  onError
}) {
  const [email, setEmail] = react.useState("");
  const [isSubmitting, setIsSubmitting] = react.useState(false);
  const [showSuccess, setShowSuccess] = react.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          alert("This email is already subscribed to our newsletter.");
        } else {
          throw new Error(data.error || "Failed to subscribe");
        }
      } else {
        setShowSuccess(true);
        onSuccess?.(email);
        setTimeout(() => {
          setEmail("");
          setShowSuccess(false);
        }, 5e3);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      const err = error instanceof Error ? error : new Error("Failed to subscribe");
      onError?.(err);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "section",
    {
      className: `py-16 bg-gradient-to-r from-[#0B1B3B]/20 to-slate-800/20 ${className}`,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: showSuccess ? /* @__PURE__ */ jsxRuntime.jsx(SuccessMessage, { title: successTitle, description: successDescription }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "svg",
          {
            className: "h-12 w-12 text-[#00E0FF] mx-auto mb-6",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: title }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xl text-slate-300 mb-8", children: description }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  type: "email",
                  placeholder: "Enter your email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  disabled: isSubmitting,
                  className: "bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 rounded-2xl flex-1 disabled:opacity-50 px-4 py-2 border focus:border-[#00E0FF] focus:ring-[#00E0FF] focus:ring-1 outline-none"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: "bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-2xl px-8 py-2 disabled:opacity-50 transition-colors",
                  children: isSubmitting ? "Subscribing..." : buttonText
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-500 mt-4", children: "No spam, unsubscribe at any time" })
      ] }) })
    }
  );
}
function ContactModal({
  open,
  onOpenChange,
  apiEndpoint = "/api/contact",
  title = "Contact Us",
  description = "Send us a message and we'll get back to you soon.",
  onSuccess,
  onError
}) {
  const [email, setEmail] = react.useState("");
  const [message, setMessage] = react.useState("");
  const [isSubmitting, setIsSubmitting] = react.useState(false);
  const [showSuccess, setShowSuccess] = react.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, message })
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      setShowSuccess(true);
      onSuccess?.({ email, message });
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setShowSuccess(false);
        onOpenChange(false);
      }, 5e3);
    } catch (error) {
      console.error("Error submitting form:", error);
      const err = error instanceof Error ? error : new Error("Failed to send message");
      onError?.(err);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleOpenChange = (newOpen) => {
    onOpenChange(newOpen);
  };
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
      onClick: () => handleOpenChange(false),
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: "bg-slate-900/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full",
          onClick: (e) => e.stopPropagation(),
          children: showSuccess ? /* @__PURE__ */ jsxRuntime.jsx(
            SuccessMessage,
            {
              title: "Message Received!",
              description: "Thank you for contacting us. We'll get back to you soon."
            }
          ) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "text-2xl font-bold text-white flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "svg",
                  {
                    className: "h-6 w-6 text-[#00E0FF]",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /* @__PURE__ */ jsxRuntime.jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      }
                    )
                  }
                ),
                title
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-slate-300", children: description })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "email", className: "text-slate-200 block text-sm font-medium", children: "Email Address" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    id: "email",
                    type: "email",
                    placeholder: "your.email@example.com",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    className: "w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none rounded-lg px-4 py-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "message", className: "text-slate-200 block text-sm font-medium", children: "Message" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "textarea",
                  {
                    id: "message",
                    placeholder: "Tell us what's on your mind...",
                    value: message,
                    onChange: (e) => setMessage(e.target.value),
                    required: true,
                    rows: 5,
                    className: "w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none resize-none rounded-lg px-4 py-2"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-3 justify-end", children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleOpenChange(false),
                    className: "text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting,
                    className: "bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 px-6 py-2 flex items-center gap-2",
                    children: isSubmitting ? "Sending..." : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                      "Send Message",
                      /* @__PURE__ */ jsxRuntime.jsx(
                        "svg",
                        {
                          className: "h-4 w-4",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          stroke: "currentColor",
                          children: /* @__PURE__ */ jsxRuntime.jsx(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 2,
                              d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            }
                          )
                        }
                      )
                    ] })
                  }
                )
              ] })
            ] })
          ] })
        }
      )
    }
  );
}

// src/forms/email.ts
function getEmailConfig() {
  return {
    contactEmail: process.env.CONTACT_EMAIL || "contact@example.com",
    fromEmail: process.env.FROM_EMAIL || "noreply@example.com",
    fromEmailAutoReply: process.env.FROM_EMAIL_AUTO_REPLY
  };
}
function createEmailConfig(config) {
  const defaults = getEmailConfig();
  return {
    ...defaults,
    ...config
  };
}
async function sendContactEmail(resend, config, data) {
  return resend.emails.send({
    from: config.fromEmail,
    to: [config.contactEmail],
    subject: `New Contact Form Submission from ${data.email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Contact Form Submission</h2>

        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.email}</p>
          <p style="margin: 0;"><strong>Date:</strong> ${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #1e293b; margin-top: 0;">Message:</h3>
          <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
          This email was sent from your contact form.
        </p>
      </div>
    `,
    text: `New Contact Form Submission

From: ${data.email}
Date: ${(/* @__PURE__ */ new Date()).toLocaleString()}

Message:
${data.message}`
  });
}

exports.ContactModal = ContactModal;
exports.NewsletterForm = NewsletterForm;
exports.SuccessMessage = SuccessMessage;
exports.createEmailConfig = createEmailConfig;
exports.getEmailConfig = getEmailConfig;
exports.sendContactEmail = sendContactEmail;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map