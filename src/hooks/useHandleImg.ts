import { ImageProps, ColumnProps, UserProps } from "../store";

// 通过阿里云图床裁剪图片
export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_fill']) {
    if(data && data.url) {
        const formatStr = format.reduce((prev, current) => {
            return current + ',' + prev;
        }, '');
        data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`;
    }
}

// 专栏图片裁剪并处理图片不存在情况
export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
    if(data.avatar) {
        generateFitUrl(data.avatar, width, height);
    } else {
        const parseCol = data as ColumnProps;
        data.avatar = {
            fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
        }
    }
}