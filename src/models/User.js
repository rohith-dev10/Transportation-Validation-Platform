const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    relatedTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "userType",
        default: null
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ["Truck Owner", "Driver", "Transportation Company"]
    },
    contactInformation: {
        phoneNumber: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        }
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    nationality: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: null
    },
    professionalNetworks: {
        linkedInProfile: {
            type: String,
            default: null
        },
        personalWebsite: {
            type: String,
            default: null
        }
    },
    identification: {
        typeOfId: {
            type: String,
            enum: ["Passport", "Driver's License", "Aadhar ID"],
            default: null
        },
        idNumber: {
            type: String,
            default: null
        },
        expiryDate: {
            type: Date,
            default: null
        }
    },
    education: {
        level: {
            type: String,
            enum: ["High School", "Bachelor's", "Master's", "PhD"],
            default: null
        },
        institution: {
            name: {
                type: String,
                default: null
            },
            degreeEarned: {
                type: String,
                default: null
            },
            fieldOfStudy: {
                type: String,
                default: null
            },
            graduationDate: {
                type: Date,
                default: null
            }
        }
    },
    employmentHistory: [{
        companyName: {
            type: String,
            default: null
        },
        jobTitle: {
            type: String,
            default: null
        },
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
        responsibilities: {
            type: String,
            default: null
        },
        achievements: {
            type: String,
            default: null
        }
    }],
    currentEmployment: {
        employer: {
            type: String,
            default: null
        },
        jobTitle: {
            type: String,
            default: null
        },
        startDate: {
            type: Date,
            default: null
        },
        responsibilities: {
            type: String,
            default: null
        }
    },
    personalCredentials: {
        languages: [{
            language: {
                type: String,
                default: null
            },
            proficiency: {
                type: String,
                default: null
            }
        }],
        skills: {
            technical: [String],
            soft: [String]
        }
    },
    recommendations: [{
        name: {
            type: String,
            default: null
        },
        relationship: {
            type: String,
            default: null
        },
        company: {
            type: String,
            default: null
        },
        contactInformation: {
            phone: {
                type: String,
                default: null
            },
            email: {
                type: String,
                default: null
            }
        },
        letterContent: {
            type: String,
            default: null
        },
        dateOfIssue: {
            type: Date,
            default: null
        },
        issuerNameAndPosition: {
            type: String,
            default: null
        }
    }],
    remarksHistory: [{
        sourceOfFeedback: {
            type: String,
            default: null,
            enum: ["Supervisor", "Peer", "Client"]
        },
        date: {
            type: Date,
            default: null
        },
        feedbackContent: {
            type: String,
            default: null
        }
    }],
    isProfileUpdated: {
        type: Boolean,
        default: false
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        default: null
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("User", UserSchema);