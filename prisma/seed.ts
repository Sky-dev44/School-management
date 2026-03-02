import { prisma } from "../lib/prisma";
import { UserSex, Day } from "../lib/generated/prisma/enums";

async function main() {
  // CLEANUP
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();

  // ADMIN
  await prisma.admin.create({ data: { id: "admin1", username: "admin1" } });
  await prisma.admin.create({ data: { id: "admin2", username: "admin2" } });

  // GRADE
  const grades = [];
  for (let i = 1; i <= 6; i++) {
    const grade = await prisma.grade.create({ data: { level: i } });
    grades.push(grade);
  }

  // CLASS
  const classes = [];
  for (let i = 0; i < 6; i++) {
    const cls = await prisma.class.create({
      data: {
        name: `${i + 1}A`,
        gradeId: grades[i].id,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
    classes.push(cls);
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  const subjects = [];
  for (const subject of subjectData) {
    const s = await prisma.subject.create({ data: subject });
    subjects.push(s);
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: subjects[i % 10].id }] },
        classes: { connect: [{ id: classes[i % 6].id }] },
      },
    });
  }

  // LESSON
  const lessons = [];
  for (let i = 1; i <= 30; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: subjects[i % 10].id,
        classId: classes[i % 6].id,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
    lessons.push(lesson);
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: grades[i % 6].id,
        classId: classes[i % 6].id,
      },
    });
  }

  // EXAM
  const exams = [];
  for (let i = 0; i < 10; i++) {
    const exam = await prisma.exam.create({
      data: {
        title: `Exam ${i + 1}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: lessons[i % lessons.length].id,
      },
    });
    exams.push(exam);
  }

  // ASSIGNMENT
  const assignments = [];
  for (let i = 0; i < 10; i++) {
    const assignment = await prisma.assignment.create({
      data: {
        title: `Assignment ${i + 1}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: lessons[i % lessons.length].id,
      },
    });
    assignments.push(assignment);
  }

  // RESULT
  for (let i = 0; i < 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: `student${i + 1}`,
        ...(i < 5
          ? { examId: exams[i].id }
          : { assignmentId: assignments[i - 5].id }),
      },
    });
  }

  // ATTENDANCE
  for (let i = 0; i < 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: true,
        studentId: `student${i + 1}`,
        lessonId: lessons[i % lessons.length].id,
      },
    });
  }

  // EVENT
  for (let i = 0; i < 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i + 1}`,
        description: `Description for Event ${i + 1}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: classes[i % classes.length].id,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 0; i < 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i + 1}`,
        description: `Description for Announcement ${i + 1}`,
        date: new Date(),
        classId: classes[i % classes.length].id,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
