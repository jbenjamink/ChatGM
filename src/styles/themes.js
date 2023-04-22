export default themes = {
  light: {
    colors: {
      primary: '#0070f3'
    }
  },
  dark: {
    colors: {
      primary: '#0070f3'
    }
  },
  modern: {
    tasksContainer: {
        hideSidebar: 'md:grid-cols-4 sm:grid-cols-3 grid-cols-2',
        default: 'lg:grid-cols-6 sm:grid-cols-3 gap-4 pt-4',
        always: 'overflow-x-hidden'
  },
  retro: {
    tasksContainer: {
        hideSidebar: 'lg:grid-cols-6 sm:grid-cols-4 xs:grid-cols-3',
        default: 'grid-cols-4',
        always: ''
  }
};
