import LessonModel from "../../database/lesson.js";
import classesService from "../classes/service.js";
import lessonsService from "../lessons/service.js";

const statisticsClassAttendanceStatus = async ({ classId }) => {
  const _class = await classesService.getClassById(classId);
  const data = _class.lessons?.map((lesson) => {
    const aiDetected =
      lesson?.attendances?.filter(
        (attendance) => attendance?.type === "AI_DETECTED"
      )?.length || 0;

    const manual =
      lesson?.attendances?.filter((attendance) => attendance?.type === "MANUAL")
        ?.length || 0;

    return {
      aiDetected,
      manual,
      absent:
        lesson?.attendances?.length > 0
          ? _class.students?.length - (aiDetected + manual) || 0
          : undefined,
    };
  });

  return data;
};

const statisticByAttendanceType = async () => {
  const aiDetectedCount = await LessonModel.aggregate([
    {
      $unwind: "$attendances",

    },
    {
      $match: {
        "attendances.type": "AI_DETECTED"
      }
    },
    {
      $group: {
        _id: "$attendances.type",
        count: { $sum: 1 }
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        count: "$count"
      }
    }]);

  const all = await LessonModel.aggregate([
    {
      $project: {
        _id: 0,
        count: { $size: "$attendances" }
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: "$count" }
      },
    },
  ]);

  return {
    aiDetectedCount: aiDetectedCount[0]?.count || 0,
    all: all[0]?.count || 0
  }
}

export default { statisticsClassAttendanceStatus, statisticByAttendanceType };
