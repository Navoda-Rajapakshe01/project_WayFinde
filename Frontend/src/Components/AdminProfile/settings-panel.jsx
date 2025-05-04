"use client";
import React from "react";
import { useState } from "react";
import {
  FaGlobe,
  FaEnvelope,
  FaKey,
  FaShieldAlt,
  FaBell,
  FaDatabase,
  FaSave,
  FaUndo,
  FaCloudUploadAlt,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);

  // Mock settings data
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "WayFinde Travellers",
    siteDescription: "Discover the best places to visit in Sri Lanka",
    contactEmail: "info@wayfinde.com",
    phoneNumber: "+94 123 456 789",
    address: "123 Main Street, Colombo, Sri Lanka",
    logoUrl: "/images/logo.png",
    faviconUrl: "/images/favicon.ico",
    currency: "USD",
    language: "en",
    timeZone: "Asia/Colombo",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "notifications@wayfinde.com",
    smtpPassword: "********",
    senderName: "WayFinde Travellers",
    senderEmail: "notifications@wayfinde.com",
    enableEmailNotifications: true,
  });

  const [apiSettings, setApiSettings] = useState({
    googleMapsApiKey: "AIza*****************",
    weatherApiKey: "abcd*****************",
    currencyApiKey: "efgh*****************",
    paymentGateway: "stripe",
    stripePublicKey: "pk_test_*****************",
    stripeSecretKey: "sk_test_*****************",
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactorAuth: true,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    sessionTimeoutMinutes: 30,
    allowedIpAddresses: "",
    enableCaptcha: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newUserSignup: true,
    newAccommodationProvider: true,
    newVehicleProvider: true,
    newReview: true,
    newBooking: true,
    systemAlerts: true,
    emailDigest: "daily",
  });

  const [maintenanceSettings, setMaintenanceSettings] = useState({
    enableMaintenanceMode: false,
    maintenanceMessage:
      "We're currently performing maintenance. Please check back soon.",
    autoBackup: true,
    backupFrequency: "daily",
    backupRetentionDays: 30,
    lastBackupDate: "2023-06-15 14:30:00",
  });

  const handleSaveSettings = () => {
    // In a real app, this would save the settings to the server
    setSaveStatus("saving");

    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1500);
  };

  const handleResetSettings = (settingsType) => {
    if (
      window.confirm(
        "Are you sure you want to reset these settings to default values? This action cannot be undone."
      )
    ) {
      // In a real app, this would reset the settings to default values
      alert(`${settingsType} settings have been reset to default values.`);
    }
  };

  const handleTestEmail = () => {
    setTestEmailStatus("sending");

    // Simulate API call
    setTimeout(() => {
      setTestEmailStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setTestEmailStatus(null);
      }, 3000);
    }, 1500);
  };

  const handleBackupNow = () => {
    setBackupStatus("inProgress");

    // Simulate API call
    setTimeout(() => {
      setBackupStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setBackupStatus(null);
      }, 3000);
    }, 2000);
  };

  const renderSaveStatus = () => {
    if (saveStatus === "saving") {
      return <span className="status-message saving">Saving changes...</span>;
    } else if (saveStatus === "success") {
      return (
        <span className="status-message success">
          <FaCheck /> Settings saved successfully
        </span>
      );
    } else if (saveStatus === "error") {
      return (
        <span className="status-message error">
          <FaExclamationTriangle /> Error saving settings
        </span>
      );
    }
    return null;
  };

  return (
    <div className="settings-panel">
      <div className="section-header">
        <h1 className="page-title">Settings</h1>
        <div className="settings-actions">
          {renderSaveStatus()}
          <button
            className="save-button"
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving"}
          >
            <FaSave /> Save All Changes
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`settings-tab ${
              activeTab === "general" ? "active" : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            <FaGlobe /> General
          </button>
          <button
            className={`settings-tab ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            <FaEnvelope /> Email
          </button>
          <button
            className={`settings-tab ${activeTab === "api" ? "active" : ""}`}
            onClick={() => setActiveTab("api")}
          >
            <FaKey /> API Keys
          </button>
          <button
            className={`settings-tab ${
              activeTab === "security" ? "active" : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <FaShieldAlt /> Security
          </button>
          <button
            className={`settings-tab ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell /> Notifications
          </button>
          <button
            className={`settings-tab ${
              activeTab === "maintenance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("maintenance")}
          >
            <FaDatabase /> Maintenance
          </button>
        </div>

        <div className="settings-content">
          {activeTab === "general" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>General Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("General")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="siteName">Site Name</label>
                    <input
                      type="text"
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          contactEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="siteDescription">Site Description</label>
                  <textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteDescription: e.target.value,
                      })
                    }
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={generalSettings.phoneNumber}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="logoUrl">Logo URL</label>
                    <div className="input-with-button">
                      <input
                        type="text"
                        id="logoUrl"
                        value={generalSettings.logoUrl}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            logoUrl: e.target.value,
                          })
                        }
                      />
                      <button className="upload-button">
                        <FaCloudUploadAlt /> Upload
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="faviconUrl">Favicon URL</label>
                    <div className="input-with-button">
                      <input
                        type="text"
                        id="faviconUrl"
                        value={generalSettings.faviconUrl}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            faviconUrl: e.target.value,
                          })
                        }
                      />
                      <button className="upload-button">
                        <FaCloudUploadAlt /> Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currency">Default Currency</label>
                    <select
                      id="currency"
                      value={generalSettings.currency}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          currency: e.target.value,
                        })
                      }
                    >
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="LKR">Sri Lankan Rupee (LKR)</option>
                      <option value="INR">Indian Rupee (INR)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="language">Default Language</label>
                    <select
                      id="language"
                      value={generalSettings.language}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          language: e.target.value,
                        })
                      }
                    >
                      <option value="en">English</option>
                      <option value="si">Sinhala</option>
                      <option value="ta">Tamil</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="timeZone">Time Zone</label>
                    <select
                      id="timeZone"
                      value={generalSettings.timeZone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          timeZone: e.target.value,
                        })
                      }
                    >
                      <option value="Asia/Colombo">
                        Asia/Colombo (GMT+5:30)
                      </option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">
                        America/New_York (GMT-4)
                      </option>
                      <option value="Europe/London">
                        Europe/London (GMT+1)
                      </option>
                      <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                      <option value="Australia/Sydney">
                        Australia/Sydney (GMT+10)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Email Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("Email")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="smtpServer">SMTP Server</label>
                    <input
                      type="text"
                      id="smtpServer"
                      value={emailSettings.smtpServer}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpServer: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="smtpPort">SMTP Port</label>
                    <input
                      type="text"
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPort: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="smtpUsername">SMTP Username</label>
                    <input
                      type="text"
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpUsername: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="smtpPassword">SMTP Password</label>
                    <input
                      type="password"
                      id="smtpPassword"
                      value={emailSettings.smtpPassword}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          smtpPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="senderName">Sender Name</label>
                    <input
                      type="text"
                      id="senderName"
                      value={emailSettings.senderName}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          senderName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="senderEmail">Sender Email</label>
                    <input
                      type="email"
                      id="senderEmail"
                      value={emailSettings.senderEmail}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          senderEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="enableEmailNotifications"
                      checked={emailSettings.enableEmailNotifications}
                      onChange={(e) =>
                        setEmailSettings({
                          ...emailSettings,
                          enableEmailNotifications: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="enableEmailNotifications">
                      Enable Email Notifications
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="test-email-button"
                    onClick={handleTestEmail}
                    disabled={testEmailStatus === "sending"}
                  >
                    {testEmailStatus === "sending"
                      ? "Sending..."
                      : "Send Test Email"}
                  </button>
                  {testEmailStatus === "success" && (
                    <span className="status-message success">
                      <FaCheck /> Test email sent successfully
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>API Integration Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("API")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="googleMapsApiKey">Google Maps API Key</label>
                  <div className="input-with-button">
                    <input
                      type="password"
                      id="googleMapsApiKey"
                      value={apiSettings.googleMapsApiKey}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          googleMapsApiKey: e.target.value,
                        })
                      }
                    />
                    <button className="show-button">Show</button>
                  </div>
                  <p className="input-help">
                    Used for maps and location services throughout the platform.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="weatherApiKey">Weather API Key</label>
                  <div className="input-with-button">
                    <input
                      type="password"
                      id="weatherApiKey"
                      value={apiSettings.weatherApiKey}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          weatherApiKey: e.target.value,
                        })
                      }
                    />
                    <button className="show-button">Show</button>
                  </div>
                  <p className="input-help">
                    Used to display weather information for destinations.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="currencyApiKey">
                    Currency Conversion API Key
                  </label>
                  <div className="input-with-button">
                    <input
                      type="password"
                      id="currencyApiKey"
                      value={apiSettings.currencyApiKey}
                      onChange={(e) =>
                        setApiSettings({
                          ...apiSettings,
                          currencyApiKey: e.target.value,
                        })
                      }
                    />
                    <button className="show-button">Show</button>
                  </div>
                  <p className="input-help">
                    Used for currency conversion in pricing displays.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="paymentGateway">Payment Gateway</label>
                  <select
                    id="paymentGateway"
                    value={apiSettings.paymentGateway}
                    onChange={(e) =>
                      setApiSettings({
                        ...apiSettings,
                        paymentGateway: e.target.value,
                      })
                    }
                  >
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="manual">Manual Payment</option>
                  </select>
                </div>

                {apiSettings.paymentGateway === "stripe" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="stripePublicKey">Stripe Public Key</label>
                      <div className="input-with-button">
                        <input
                          type="password"
                          id="stripePublicKey"
                          value={apiSettings.stripePublicKey}
                          onChange={(e) =>
                            setApiSettings({
                              ...apiSettings,
                              stripePublicKey: e.target.value,
                            })
                          }
                        />
                        <button className="show-button">Show</button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="stripeSecretKey">Stripe Secret Key</label>
                      <div className="input-with-button">
                        <input
                          type="password"
                          id="stripeSecretKey"
                          value={apiSettings.stripeSecretKey}
                          onChange={(e) =>
                            setApiSettings({
                              ...apiSettings,
                              stripeSecretKey: e.target.value,
                            })
                          }
                        />
                        <button className="show-button">Show</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Security Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("Security")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="enableTwoFactorAuth"
                      checked={securitySettings.enableTwoFactorAuth}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableTwoFactorAuth: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="enableTwoFactorAuth">
                      Enable Two-Factor Authentication for Admin Users
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="passwordExpiryDays">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      id="passwordExpiryDays"
                      value={securitySettings.passwordExpiryDays}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordExpiryDays: e.target.value,
                        })
                      }
                      min="0"
                      max="365"
                    />
                    <p className="input-help">Set to 0 for no expiry.</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxLoginAttempts">Max Login Attempts</label>
                    <input
                      type="number"
                      id="maxLoginAttempts"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maxLoginAttempts: e.target.value,
                        })
                      }
                      min="1"
                      max="10"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="sessionTimeoutMinutes">
                    Session Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeoutMinutes"
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeoutMinutes: e.target.value,
                      })
                    }
                    min="5"
                    max="1440"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="allowedIpAddresses">
                    Allowed IP Addresses
                  </label>
                  <textarea
                    id="allowedIpAddresses"
                    value={securitySettings.allowedIpAddresses}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        allowedIpAddresses: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Leave blank to allow all IPs. Enter one IP per line."
                  ></textarea>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="enableCaptcha"
                      checked={securitySettings.enableCaptcha}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          enableCaptcha: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="enableCaptcha">
                      Enable CAPTCHA on Login and Registration Forms
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Notification Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("Notification")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-section-title">Admin Notifications</div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newUserSignup"
                      checked={notificationSettings.newUserSignup}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newUserSignup: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="newUserSignup">New User Signup</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newAccommodationProvider"
                      checked={notificationSettings.newAccommodationProvider}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newAccommodationProvider: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="newAccommodationProvider">
                      New Accommodation Provider Registration
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newVehicleProvider"
                      checked={notificationSettings.newVehicleProvider}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newVehicleProvider: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="newVehicleProvider">
                      New Vehicle Provider Registration
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newReview"
                      checked={notificationSettings.newReview}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newReview: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="newReview">New Review Submitted</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="newBooking"
                      checked={notificationSettings.newBooking}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          newBooking: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="newBooking">New Booking</label>
                  </div>
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="systemAlerts"
                      checked={notificationSettings.systemAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          systemAlerts: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="systemAlerts">System Alerts</label>
                  </div>
                </div>

                <div className="form-section-title">Email Digest</div>

                <div className="form-group">
                  <label htmlFor="emailDigest">Email Digest Frequency</label>
                  <select
                    id="emailDigest"
                    value={notificationSettings.emailDigest}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailDigest: e.target.value,
                      })
                    }
                  >
                    <option value="disabled">Disabled</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Maintenance & Backup Settings</h2>
                <button
                  className="reset-button"
                  onClick={() => handleResetSettings("Maintenance")}
                >
                  <FaUndo /> Reset to Default
                </button>
              </div>

              <div className="settings-form">
                <div className="form-section-title">Maintenance Mode</div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="enableMaintenanceMode"
                      checked={maintenanceSettings.enableMaintenanceMode}
                      onChange={(e) =>
                        setMaintenanceSettings({
                          ...maintenanceSettings,
                          enableMaintenanceMode: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="enableMaintenanceMode">
                      Enable Maintenance Mode
                    </label>
                  </div>
                  <p className="input-help">
                    When enabled, the site will display a maintenance message to
                    visitors.
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="maintenanceMessage">
                    Maintenance Message
                  </label>
                  <textarea
                    id="maintenanceMessage"
                    value={maintenanceSettings.maintenanceMessage}
                    onChange={(e) =>
                      setMaintenanceSettings({
                        ...maintenanceSettings,
                        maintenanceMessage: e.target.value,
                      })
                    }
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-section-title">Database Backup</div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      checked={maintenanceSettings.autoBackup}
                      onChange={(e) =>
                        setMaintenanceSettings({
                          ...maintenanceSettings,
                          autoBackup: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="autoBackup">Enable Automatic Backups</label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="backupFrequency">Backup Frequency</label>
                    <select
                      id="backupFrequency"
                      value={maintenanceSettings.backupFrequency}
                      onChange={(e) =>
                        setMaintenanceSettings({
                          ...maintenanceSettings,
                          backupFrequency: e.target.value,
                        })
                      }
                      disabled={!maintenanceSettings.autoBackup}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="backupRetentionDays">
                      Backup Retention (Days)
                    </label>
                    <input
                      type="number"
                      id="backupRetentionDays"
                      value={maintenanceSettings.backupRetentionDays}
                      onChange={(e) =>
                        setMaintenanceSettings({
                          ...maintenanceSettings,
                          backupRetentionDays: e.target.value,
                        })
                      }
                      min="1"
                      max="365"
                      disabled={!maintenanceSettings.autoBackup}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Last Backup</label>
                  <div className="info-display">
                    {maintenanceSettings.lastBackupDate || "No backup yet"}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="backup-now-button"
                    onClick={handleBackupNow}
                    disabled={backupStatus === "inProgress"}
                  >
                    {backupStatus === "inProgress"
                      ? "Backing up..."
                      : "Backup Now"}
                  </button>
                  {backupStatus === "success" && (
                    <span className="status-message success">
                      <FaCheck /> Backup completed successfully
                    </span>
                  )}
                </div>

                <div className="form-section-title">Database Optimization</div>

                <div className="form-actions">
                  <button className="optimize-button">Optimize Database</button>
                  <button className="clear-cache-button">Clear Cache</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
