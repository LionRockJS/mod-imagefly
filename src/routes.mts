import { RouteList } from '@lionrockjs/router';
RouteList.add('/imagefly/:options(^\\w+)/*', 'controller/ImageFly');