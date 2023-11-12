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

export default { statisticsClassAttendanceStatus };
