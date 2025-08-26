from mongoengine import Document, StringField, DateTimeField, ReferenceField, ListField, IntField, FloatField
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    phone = StringField(unique=True, required=True)
    password_hash = StringField(required=True)
    role = StringField(default='parent')
    status = StringField(default='active')
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(str(self.password_hash), password)

class Student(Document):
    full_name = StringField(required=True)
    phone = StringField()
    date_of_birth = StringField()  # Store as string YYYY-MM-DD
    gender = StringField()
    address = StringField()
    parent_name = StringField()
    parent_phone = StringField()
    class_id = ReferenceField('Class')
    parent_user_id = ReferenceField('User')
    status = StringField(default='active')
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

class Teacher(Document):
    user_id = ReferenceField('User')
    full_name = StringField(required=True)
    position = StringField()  # Chức vụ
    date_of_birth = StringField()  # Ngày sinh
    subject = StringField()  # Môn học chính
    phone = StringField()
    email = StringField()
    subjects = ListField(StringField())  # Các môn học có thể dạy
    status = StringField(default='active')
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

class Class(Document):
    name = StringField(required=True)
    grade = StringField()
    homeroom_teacher_id = ReferenceField('Teacher')
    school_year = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

class Schedule(Document):
    class_id = ReferenceField('Class')
    weekday = IntField()
    period = IntField()
    subject = StringField()
    teacher_id = ReferenceField('Teacher')
    room = StringField()
    start_time = StringField() # Storing as HH:MM string
    end_time = StringField()

class Exam(Document):
    class_id = ReferenceField('Class')
    subject = StringField()
    name = StringField()
    date = DateTimeField()
    weight = FloatField()
    description = StringField()

class ExamResult(Document):
    exam_id = ReferenceField('Exam')
    student_id = ReferenceField('Student')
    score = FloatField()
    comment = StringField()

class Homework(Document):
    class_id = ReferenceField('Class')
    subject = StringField()
    title = StringField()
    description = StringField()
    due_date = DateTimeField()
    attachments = ListField(StringField())

class Fee(Document):
    student_id = ReferenceField('Student')
    amount = FloatField()
    type = StringField()
    due_date = DateTimeField()
    status = StringField(default='unpaid')
    note = StringField()

class Payment(Document):
    student_id = ReferenceField('Student')
    amount = FloatField()
    method = StringField()
    transaction_id = StringField()
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

class Verification(Document):
    phone = StringField()
    code_hash = StringField()
    purpose = StringField()
    expires_at = DateTimeField()
    attempts = IntField(default=0)
    status = StringField(default='pending')
