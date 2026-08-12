import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ScanHistory(db.Model):
    __tablename__ = 'scan_history'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2048), nullable=False)
    verdict = db.Column(db.String(50), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    score = db.Column(db.Float, nullable=False)
    checked_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "url": self.url,
            "verdict": self.verdict,
            "confidence": self.confidence,
            "score": self.score,
            "checked_at": self.checked_at.isoformat()
        }

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2048), nullable=False)
    original_verdict = db.Column(db.String(50), nullable=False)
    reported_as = db.Column(db.String(50), nullable=False)
    reported_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "url": self.url,
            "original_verdict": self.original_verdict,
            "reported_as": self.reported_as,
            "reported_at": self.reported_at.isoformat()
        }
