from flask import Blueprint, jsonify
from models import Student, Schedule, Exam, ExamResult, Homework, Fee, Payment
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user', __name__)
STUDENT_NOT_FOUND = {'message': 'Student not found'}

@user_bp.route('/schedules', methods=['GET'])
@jwt_required()
def get_schedules():
    user_id = get_jwt_identity()
    student = Student.objects(parent_user_id=user_id).first()

    if not student:
        return jsonify(STUDENT_NOT_FOUND), 404

    schedules = Schedule.objects(class_id=student.class_id)

    return jsonify([{
        'id': str(s.id),
        'weekday': s.weekday,
        'period': s.period,
        'subject': s.subject,
        'room': s.room,
        'start_time': s.start_time,
        'end_time': s.end_time
    } for s in schedules])

@user_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_balance():
    user_id = get_jwt_identity()
    student = Student.objects(parent_user_id=user_id).first()

    if not student:
        return jsonify(STUDENT_NOT_FOUND), 404

    fees = Fee.objects(student_id=student.id)
    payments = Payment.objects(student_id=student.id)

    total_fees = sum(f.amount for f in fees)
    total_paid = sum(p.amount for p in payments)
    balance = total_fees - total_paid

    return jsonify({
        'total_fees': total_fees,
        'total_paid': total_paid,
        'balance': balance,
        'fees': [{
            'id': str(f.id),
            'amount': f.amount,
            'type': f.type,
            'due_date': f.due_date.isoformat() if f.due_date else None,
            'status': f.status
        } for f in fees],
        'payments': [{
            'id': str(p.id),
            'amount': p.amount,
            'method': p.method,
            'created_at': p.created_at.isoformat()
        } for p in payments]
    })

@user_bp.route('/exams', methods=['GET'])
@jwt_required()
def get_exams():
    user_id = get_jwt_identity()
    student = Student.objects(parent_user_id=user_id).first()

    if not student:
        return jsonify(STUDENT_NOT_FOUND), 404

    exams = Exam.objects(class_id=student.class_id)

    return jsonify([{
        'id': str(e.id),
        'name': e.name,
        'subject': e.subject,
        'date': e.date.isoformat() if e.date else None,
        'description': e.description
    } for e in exams])

@user_bp.route('/grades', methods=['GET'])
@jwt_required()
def get_grades():
    user_id = get_jwt_identity()
    student = Student.objects(parent_user_id=user_id).first()

    if not student:
        return jsonify(STUDENT_NOT_FOUND), 404

    results = ExamResult.objects(student_id=student.id)

    return jsonify([{
        'id': str(r.id),
        'exam_name': r.exam_id.name if r.exam_id else None,
        'subject': r.exam_id.subject if r.exam_id else None,
        'score': r.score,
        'comment': r.comment,
        'date': r.exam_id.date.isoformat() if r.exam_id and r.exam_id.date else None
    } for r in results])

@user_bp.route('/homeworks', methods=['GET'])
@jwt_required()
def get_homeworks():
    user_id = get_jwt_identity()
    student = Student.objects(parent_user_id=user_id).first()

    if not student:
        return jsonify(STUDENT_NOT_FOUND), 404

    homeworks = Homework.objects(class_id=student.class_id)

    return jsonify([{
        'id': str(h.id),
        'title': h.title,
        'subject': h.subject,
        'description': h.description,
        'due_date': h.due_date.isoformat() if h.due_date else None,
        'attachments': h.attachments
    } for h in homeworks])
