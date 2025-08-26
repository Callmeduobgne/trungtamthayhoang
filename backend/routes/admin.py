from flask import Blueprint, request, jsonify
from models import User, Student, Teacher, Class, Schedule, Exam, ExamResult, Homework, Fee, Payment
from flask_jwt_extended import jwt_required
from utils import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/health', methods=['GET'])
def health_check():
    try:
        # Thử truy vấn một thông tin đơn giản từ DB
        student_count = Student.objects.count()
        return jsonify({'status': 'ok', 'db_connection': True, 'student_count': student_count}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'db_connection': False, 'message': str(e)}), 500


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    try:
        total_students = Student.objects.count()
        active_students = Student.objects(status='active').count()
        total_teachers = Teacher.objects.count()
        total_classes = Class.objects.count()

        stats = {
            'students': total_students,
            'activeStudents': active_students,
            'teachers': total_teachers,
            'classes': total_classes
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@admin_bp.route('/students', methods=['GET'])
@admin_required
def get_students():
    try:
        search = request.args.get('search', '')

        if search:
            students = Student.objects(full_name__icontains=search)
        else:
            students = Student.objects()

        students_data = []
        for student in students:
            student_dict = student.to_mongo().to_dict()
            student_dict['_id'] = str(student_dict['_id'])

            if student.class_id:
                class_obj = Class.objects(id=student.class_id).first()
                student_dict['class_name'] = class_obj.name if class_obj else 'N/A'
            else:
                student_dict['class_name'] = 'N/A'

            students_data.append(student_dict)

        return jsonify({'students': students_data}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/students', methods=['POST'])
@admin_required
def create_student():
    try:
        data = request.get_json()

        if Student.objects(phone=data['phone']).first():
            return jsonify({'message': 'Phone exists'}), 409

        student = Student(
            full_name=data['full_name'],
            phone=data['phone'],
            date_of_birth=data.get('date_of_birth', ''),
            gender=data.get('gender', ''),
            address=data.get('address', ''),
            class_id=data.get('class_id', ''),
            parent_name=data.get('parent_name', ''),
            parent_phone=data.get('parent_phone', ''),
            status='active'
        )

        student.save()

        return jsonify({'message': 'Student created'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/students/<student_id>', methods=['PUT'])
@admin_required
def update_student(student_id):
    try:
        student = Student.objects(id=student_id).first()
        if not student:
            return jsonify({'message': 'Student not found'}), 404

        data = request.get_json()

        student.full_name = data.get('full_name', student.full_name)
        student.phone = data.get('phone', student.phone)
        student.date_of_birth = data.get('date_of_birth', student.date_of_birth)
        student.gender = data.get('gender', student.gender)
        student.address = data.get('address', student.address)
        student.parent_name = data.get('parent_name', student.parent_name)
        student.parent_phone = data.get('parent_phone', student.parent_phone)
        student.status = data.get('status', student.status)

        student.save()

        return jsonify({'message': 'Student updated'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/students/<student_id>', methods=['DELETE'])
@admin_required
def delete_student(student_id):
    try:
        student = Student.objects(id=student_id).first()
        if not student:
            return jsonify({'message': 'Student not found'}), 404

        student.status = 'deleted'
        student.save()

        return jsonify({'message': 'Student deleted'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Teacher Management Routes
@admin_bp.route('/teachers', methods=['GET'])
@admin_required
def get_teachers():
    try:
        search = request.args.get('search', '')

        if search:
            teachers = Teacher.objects(full_name__icontains=search)
        else:
            teachers = Teacher.objects()

        teachers_data = []
        for teacher in teachers:
            teacher_dict = teacher.to_mongo().to_dict()
            teacher_dict['_id'] = str(teacher_dict['_id'])
            teachers_data.append(teacher_dict)

        return jsonify({'teachers': teachers_data}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/teachers', methods=['POST'])
@admin_required
def create_teacher():
    try:
        data = request.get_json()

        teacher = Teacher(
            full_name=data['full_name'],
            position=data.get('position', ''),
            date_of_birth=data.get('date_of_birth', ''),
            subject=data.get('subject', ''),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            status=data.get('status', 'active')
        )

        teacher.save()

        return jsonify({'message': 'Teacher created', 'teacher_id': str(teacher.id)}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/teachers/<teacher_id>', methods=['PUT'])
@admin_required
def update_teacher(teacher_id):
    try:
        teacher = Teacher.objects(id=teacher_id).first()
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404

        data = request.get_json()

        teacher.full_name = data.get('full_name', teacher.full_name)
        teacher.position = data.get('position', teacher.position)
        teacher.date_of_birth = data.get('date_of_birth', teacher.date_of_birth)
        teacher.subject = data.get('subject', teacher.subject)
        teacher.phone = data.get('phone', teacher.phone)
        teacher.email = data.get('email', teacher.email)
        teacher.status = data.get('status', teacher.status)

        teacher.save()

        return jsonify({'message': 'Teacher updated'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/teachers/<teacher_id>', methods=['DELETE'])
@admin_required
def delete_teacher(teacher_id):
    try:
        teacher = Teacher.objects(id=teacher_id).first()
        if not teacher:
            return jsonify({'message': 'Teacher not found'}), 404

        teacher.status = 'deleted'
        teacher.save()

        return jsonify({'message': 'Teacher deleted'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@admin_bp.route('/classes', methods=['GET', 'POST'])
@jwt_required()
def classes():
    if request.method == 'POST':
        data = request.get_json()
        new_class = Class(**data).save()
        return jsonify({'id': str(new_class.id)}), 201

    classes = Class.objects()
    return jsonify([{'id': str(c.id), 'name': c.name, 'grade': c.grade} for c in classes])

@admin_bp.route('/classes/<string:class_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def class_detail(class_id):
    if request.method == 'PATCH':
        data = request.get_json()
        Class.objects(id=class_id).update_one(**data)
        return jsonify({'message': 'Updated'})

    if request.method == 'DELETE':
        Class.objects(id=class_id).delete()
        return jsonify({'message': 'Deleted'})

@admin_bp.route('/students', methods=['GET', 'POST'])
@jwt_required()
def students():
    if request.method == 'POST':
        data = request.get_json()
        new_student = Student(**data).save()
        return jsonify({'id': str(new_student.id)}), 201

    students = Student.objects()
    return jsonify([{'id': str(s.id), 'full_name': s.full_name, 'class_id': str(s.class_id.id) if s.class_id else None} for s in students])

@admin_bp.route('/students/<string:student_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def student_detail(student_id):
    if request.method == 'PATCH':
        data = request.get_json()
        Student.objects(id=student_id).update_one(**data)
        return jsonify({'message': 'Updated'})

    if request.method == 'DELETE':
        Student.objects(id=student_id).delete()
        return jsonify({'message': 'Deleted'})

@admin_bp.route('/teachers', methods=['GET', 'POST'])
@jwt_required()
def teachers():
    if request.method == 'POST':
        data = request.get_json()
        new_teacher = Teacher(**data).save()
        return jsonify({'id': str(new_teacher.id)}), 201

    teachers = Teacher.objects()
    return jsonify([{'id': str(t.id), 'full_name': t.full_name, 'subjects': t.subjects} for t in teachers])

@admin_bp.route('/schedules', methods=['GET', 'POST'])
@jwt_required()
def schedules():
    if request.method == 'POST':
        data = request.get_json()
        new_schedule = Schedule(**data).save()
        return jsonify({'id': str(new_schedule.id)}), 201

    schedules = Schedule.objects()
    return jsonify([{
        'id': str(s.id), 'class_id': str(s.class_id.id) if s.class_id else None, 'weekday': s.weekday,
        'subject': s.subject, 'room': s.room
    } for s in schedules])

@admin_bp.route('/exams', methods=['GET', 'POST'])
@jwt_required()
def exams():
    if request.method == 'POST':
        data = request.get_json()
        new_exam = Exam(**data).save()
        return jsonify({'id': str(new_exam.id)}), 201

    exams = Exam.objects()
    return jsonify([{
        'id': str(e.id), 'name': e.name, 'subject': e.subject, 'date': e.date.isoformat() if e.date else None
    } for e in exams])

@admin_bp.route('/exam-results', methods=['GET', 'POST'])
@jwt_required()
def exam_results():
    if request.method == 'POST':
        data = request.get_json()
        new_result = ExamResult(**data).save()
        return jsonify({'id': str(new_result.id)}), 201

    results = ExamResult.objects()
    return jsonify([{
        'id': str(r.id), 'exam_id': str(r.exam_id.id) if r.exam_id else None, 'student_id': str(r.student_id.id) if r.student_id else None, 'score': r.score
    } for r in results])

@admin_bp.route('/fees', methods=['GET', 'POST'])
@jwt_required()
def fees():
    if request.method == 'POST':
        data = request.get_json()
        new_fee = Fee(**data).save()
        return jsonify({'id': str(new_fee.id)}), 201

    fees = Fee.objects()
    return jsonify([{
        'id': str(f.id), 'student_id': str(f.student_id.id) if f.student_id else None, 'amount': f.amount, 'status': f.status
    } for f in fees])

@admin_bp.route('/payments', methods=['GET', 'POST'])
@jwt_required()
def payments():
    if request.method == 'POST':
        data = request.get_json()
        new_payment = Payment(**data).save()
        return jsonify({'id': str(new_payment.id)}), 201

    payments = Payment.objects()
    return jsonify([{
        'id': str(p.id), 'student_id': str(p.student_id.id) if p.student_id else None, 'amount': p.amount, 'method': p.method
    } for p in payments])

@admin_bp.route('/homeworks', methods=['GET', 'POST'])
@jwt_required()
def homeworks():
    if request.method == 'POST':
        data = request.get_json()
        new_homework = Homework(**data).save()
        return jsonify({'id': str(new_homework.id)}), 201

    homeworks = Homework.objects()
    return jsonify([{
        'id': str(h.id), 'title': h.title, 'subject': h.subject, 'due_date': h.due_date.isoformat() if h.due_date else None
    } for h in homeworks])
