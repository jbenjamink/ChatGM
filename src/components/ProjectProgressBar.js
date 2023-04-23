export default function ProjectProgressBar({ tasks }) {
  const totalPoints = tasks.reduce(
    (acc, task) => (task.pointValue ? acc + task.pointValue : acc),
    0
  );
  const completedPoints = tasks.reduce((acc, task) => {
    if (task.labels.includes('completed')) {
      return task.pointValue ? acc + task.pointValue : acc;
    }
    return acc;
  }, 0);

  return (
    <div className='flex'>
      <main className='w-full bg-dark-blue p-2 pl-4 pr-4 flex justify-between'>
        {Array(completedPoints)
          .fill()
          .map((_, index) => (
            <span className='' key={index}>
              <i className='fa-solid fa-star font-8'></i>
            </span>
          ))}
        {Array(totalPoints - completedPoints)
          .fill()
          .map((_, index) => (
            <span className='' key={index}>
              <i className='fa-light fa-star font-8'></i>
            </span>
          ))}
      </main>
    </div>
  );
}
