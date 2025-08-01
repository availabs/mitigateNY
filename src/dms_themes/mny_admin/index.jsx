import React from 'react'
import { Link } from 'react-router'

const MNYLogo = ({color='#5d87a1', width=175,height=50}) => (
  <svg width={`${width}px`} height={`${height}px`}>
    <path 
      fill={color} 
      stroke={'none'}
        style={{transform: `scale(0.19)`}}
        d="m234.2 250.8c-1.5726-1.5726-1.5153-3.3974 0.2088-6.6457 0.77484-1.4599 1.9438-5.2942 2.5978-8.5208 1.0128-4.9972 0.96511-6.0904-0.32186-7.3773-0.83096-0.83096-7.7375-5.2029-15.348-9.7154-9.2951-5.5115-14.265-9.0804-15.142-10.873-0.91101-1.8632-2.0821-2.6681-3.8819-2.6681-5.4563 0-11.294-9.3264-11.308-18.065-5e-3 -3.0096-0.51174-3.8252-3.2556-5.2369-1.7875-0.91966-4.5204-2.6905-6.0731-3.9352l-2.8232-2.2631-88.039-0.22091c-64.659-0.16224-88.408-0.52671-89.427-1.3724-0.97957-0.81297-1.3875-3.5937-1.3875-9.4577 0-9.0369 0.53268-10.137 6.3447-13.109 1.7354-0.88713 4.8225-3.1071 6.8602-4.9334s5.5254-4.2492 7.7504-5.3843c2.2693-1.1577 5.1405-3.7985 6.5396-6.0148 1.3718-2.173 3.8902-4.6729 5.5964-5.5552 2.5407-1.3138 2.9666-1.9978 2.353-3.7785-0.41212-1.1958-0.84817-4.1919-0.969-6.658-0.18676-3.8118-0.57606-4.5673-2.5975-5.0413-2.1402-0.50186-2.4073-1.1693-2.6732-6.6777-0.35717-7.3994 0.37566-8.1085 12.295-11.897 14.512-4.6125 40.563-3.6811 47.862 1.7113 2.6649 1.9686 3.2635 2.0292 8.6866 0.87832 3.2035-0.67982 7.4648-0.9283 9.4697-0.55218 5.0534 0.94803 17.049-2.2309 20.519-5.4375 5.8549-5.4115 10.304-8 13.752-8h3.4668l-0.81045-4.25c-1.3009-6.8218-0.95445-10.226 1.3732-13.495 2.7551-3.8692 2.7314-4.2551-0.26168-4.2551-3.0676 0-5.5567-3.4272-5.5567-7.6511 0-3.8814 1.2954-5.2624 9.3068-9.9212 8.2047-4.7713 12.511-9.0365 13.743-13.613 1.6972-6.303 23.745-24.714 33.876-28.289 2.7344-0.96477 9.804-1.3616 24.702-1.3868 11.479-0.0194 24.802-0.34116 29.606-0.71507 6.005-0.46739 9.65-0.30061 11.664 0.53371 3.623 1.5007 5.5654 5.6912 4.2463 9.1607-0.58348 1.5347-0.59019 3.1212-0.0175 4.1445 0.59863 1.0697 0.45236 3.5348-0.41223 6.9474-1.1585 4.5727-1.6704 5.2894-3.7777 5.2894-2.4166 0-2.4376-0.0839-2.4376-9.739 0-6.0662-0.40831-9.8957-1.0827-10.154-0.59549-0.22847-7.7955-5.5e-4 -16 0.50649s-21.217 0.82652-28.917 0.70996c-13.55-0.20512-14.173-0.12269-19.383 2.5667-2.9605 1.5282-7.4605 4.6736-10 6.9897-2.5395 2.3161-6.9719 6.1386-9.8498 8.4944-3.9317 3.2184-5.5106 5.3156-6.3508 8.4358-1.3116 4.8711-5.4292 8.8908-15.185 14.824-8.0091 4.8708-8.8431 5.8667-4.9134 5.8667 1.6151 0 3.5439 0.73184 4.2863 1.6263 2.0641 2.4871 1.6458 8.5107-0.83268 11.991-1.9268 2.706-2.112 3.9043-1.5814 10.234 0.69434 8.282-0.82668 11.149-5.9156 11.149-3.1289 0-11.082 4.9116-14.098 8.7067-1.0024 1.2613-2.8583 2.2933-4.1243 2.2933s-4.2148 0.675-6.5532 1.5c-2.3964 0.8455-7.681 1.5-12.111 1.5-4.323 0-9.8579 0.53438-12.3 1.1875-4.1503 1.11-4.6895 1.0155-8.2644-1.4487-5.1697-3.5637-10.804-4.6853-23.68-4.7143-10.883-0.0245-20.102 1.6097-25.85 4.5819-3.268 1.6899-3.6408 3.9902-0.79328 4.894 2.8085 0.89139 4.0456 3.6931 3.855 8.7308-0.08999 2.3792 0.39383 5.3674 1.0752 6.6404 1.8562 3.4684 0.50288 6.8014-4.1221 10.152-2.2814 1.6527-4.9812 4.3748-5.9995 6.0493s-3.2584 3.8056-4.978 4.736c-1.7196 0.93033-5.3213 3.6005-8.0038 5.9338-2.6825 2.3332-6.6662 5.1549-8.8526 6.2703-3.8301 1.954-3.9753 2.21-3.9753 7.0077v4.9797l84.75 0.0245c54.842 0.0158 86.338 0.39023 89.25 1.061 2.475 0.57009 5.4 1.8564 6.5 2.8586s3.498 2.5796 5.3288 3.5054c3.935 1.9899 6.1712 6.6396 6.1712 12.831 0 3.4532 0.56446 4.8701 2.75 6.9033 1.5125 1.4071 4.0177 2.8574 5.5671 3.223 1.5803 0.37289 3.5202 1.8897 4.4185 3.455 1.0391 1.8105 6.8596 5.9155 16.576 11.69 11.126 6.6129 15.278 9.6198 16.152 11.7 1.1225 2.6697 1.2534 2.7164 2.806 1.0008 1.1163-1.2336 1.3347-2.2641 0.69442-3.2767-1.7692-2.7978-0.95499-4.9542 2.7578-7.304l3.7226-2.356-0.18725-7.9086c-0.10299-4.3497 0.13436-9.9336 0.52743-12.409 0.62619-3.9428 1.0243-4.5 3.2147-4.5 2.4964 0 2.5001 0.0145 2.5545 10 0.03 5.5 0.42011 11.649 0.86692 13.664 0.76792 3.4637 0.61517 3.792-2.7922 6-2.6901 1.7433-3.6077 3.0335-3.6169 5.0858-7e-3 1.5125 0.19066 2.75 0.43883 2.75s2.9347-0.64686 5.97-1.4375c3.0353-0.79061 9.9198-1.7469 15.299-2.125 5.778-0.40623 12.799-1.6594 17.158-3.0625 8.7003-2.8007 10.232-2.8869 14.263-0.80237 2.0879 1.0797 4.2531 1.3678 6.9082 0.91922 5.5874-0.94398 7.9515 0.073 7.9515 3.4206 0 4.1826-2.9568 6.1198-16.32 10.692-6.6988 2.2921-14.205 4.866-16.68 5.7198s-8.1 2.2755-12.5 3.1595c-4.4 0.88396-9.8 2.0488-12 2.5886-4.8983 1.2018-27.595 5.9272-28.469 5.9272-0.34712 0-1.1711-0.54-1.8311-1.2zm22.3-9.4383c8.0536-2.2335 17.582-4.3746 23.599-5.3032 3.0795-0.47519 7.3545-1.756 9.5-2.8461 2.1455-1.0902 6.7133-2.7682 10.151-3.729 3.4375-0.96079 6.25-2.0294 6.25-2.3746s-0.81315-1.1355-1.807-1.7562c-1.4153-0.88388-3.4204-0.60285-9.25 1.2965-4.7155 1.5363-11.657 2.7536-18.943 3.3219-11.012 0.85886-18.769 2.7899-25.788 6.4192-1.7122 0.88543-3.998 1.6099-5.0795 1.6099-2.1912 0-3.0463 1.5793-2.3365 4.3153 0.52185 2.0115 3.8458 1.7802 13.704-0.95363zm197.99 9.4585c-0.27653-0.72608-0.38701-57.345-0.24553-125.82l0.25725-124.5h5v251l-2.2545 0.32014c-1.24 0.17607-2.4807-0.27393-2.7572-1zm-141.73-11.32c-0.26285-1.375-0.0903-2.5 0.38342-2.5 0.47373 0 0.86133 1.125 0.86133 2.5s-0.17254 2.5-0.38342 2.5c-0.21089 0-0.59848-1.125-0.86133-2.5zm3.3237 0.25c-0.0812-2.8296 1.3028-3.7176 2.3377-1.5 0.46666 1 0.7 1 1.1667 0 1.0287-2.2044 2.4172-1.3372 2.4014 1.5-0.0108 1.9329-0.27194 2.345-0.87895 1.3868-0.72914-1.1509-0.9485-1.1509-1.4086 0s-0.69365 1.1509-1.5 0c-0.80634-1.1509-1.0395-1.1509-1.4972 0-0.29816 0.74973-0.57763 0.12565-0.62105-1.3868zm-68.079-56.45c-8.1288-2.9402-9.7296-5.3852-6.5232-9.963 1.4615-2.0866 1.516-2.0893 5.25-0.25957 6.2409 3.0582 11.408 3.4483 14.299 1.0795 2.1956-1.799 2.3053-2.1937 0.97432-3.5034-0.825-0.81181-4.5252-2.3974-8.2226-3.5235-10.854-3.3057-13.777-6.2186-13.777-13.726 0-8.7045 5.4454-12.828 17-12.874 12.113-0.0477 16.777 3.2909 12.592 9.0135-1.2827 1.7542-1.7358 1.8068-5.0976 0.59113-4.3498-1.5729-10.283-1.7457-11.688-0.34043-2.1807 2.1807-0.25814 4.5333 5.1938 6.3554 13.201 4.412 16 6.9224 16 14.351 0 8.7114-6.4335 13.5-18 13.399-3.575-0.0313-7.175-0.30114-8-0.59955zm41.75 0.0111c-1.5795-0.41272-1.75-2.1018-1.75-17.334v-16.877l-11.5-0.59981-0.31037-3.75-0.31036-3.75h17.592c19.061 0 19.468 0.12363 18.118 5.5022-0.58112 2.3154-1.0636 2.4978-6.6078 2.4978h-5.981v16.893c0 14.482-0.22578 16.98-1.5818 17.5-1.7332 0.6651-4.9398 0.63067-7.6682-0.0823zm19 0c-0.9625-0.25152-1.75-0.58567-1.75-0.74254 0-0.15686 3.7446-9.4614 8.3212-20.677l8.3212-20.391 11.052-0.5907 8.1526 20.019c4.4839 11.011 8.1526 20.433 8.1526 20.938 0 2.3572-8.0689 2.9215-10.272 0.71839-0.77816-0.77816-1.9899-2.8032-2.6928-4.5-1.2661-3.0566-1.3469-3.0852-8.7309-3.0852h-7.4529l-1.6757 3.9452c-1.9879 4.6801-5.3322 5.9579-11.426 4.3654zm23.932-18.061c-1.1402-3.622-3.5963-9.7222-3.6385-9.037-0.0241 0.39214-0.93732 2.9796-2.0293 5.75l-1.9854 5.037h4.102c3.4499 0 4.0145-0.27821 3.5511-1.75zm28.068 18.061c-1.5795-0.41275-1.75-2.1019-1.75-17.334v-16.877l-11.5-0.59981-0.31037-3.75-0.31036-3.75h17.592c19.061 0 19.468 0.12363 18.118 5.5022-0.58112 2.3154-1.0636 2.4978-6.6078 2.4978h-5.981v16.893c0 14.482-0.22578 16.98-1.5818 17.5-1.7332 0.6651-4.9398 0.63067-7.6682-0.0823zm27.25-20.782v-21.528h13.031c14.109 0 14.862 0.30561 13.557 5.5022-0.59921 2.3875-0.95993 2.4978-8.1682 2.4978h-7.5413l0.31036 3.75 0.31037 3.75 11.615 0.60323-0.61458 7.3968-11.5 0.59981v9.8193l16.5 0.58088v8l-27.5 0.55644zm283.28 17.818c-9.4587-3.3493-12.495-13.232-5.9716-19.439l3.3046-3.1443-2.8046-2.8045c-4.3208-4.3208-3.5466-9.9884 2.0034-14.666l2.6196-2.208-2.0888-2.292c-3.4677-3.805-4.5482-6.781-4.6019-12.674-0.0862-9.4647 4.7809-15.709 14.492-18.593 6.1596-1.8292 9.5685-1.896 18.51-0.36269 5.9321 1.0172 7.2325 0.94538 10.441-0.57693 4.0577-1.9255 6.909-1.1567 8.7975 2.3721 1.7565 3.2821 1.1416 5.0186-2.37 6.6932l-3.3929 1.618 1.4891 3.5638c3.0468 7.2919-0.61674 16.269-8.5403 20.927-4.2586 2.5034-5.654 2.7611-16.092 2.9712-11.912 0.23982-14.55 1.2182-11.503 4.2659 1.1191 1.1195 4.9485 1.6375 15.214 2.0582 15.342 0.6287 18.939 1.7992 22.259 7.2444 3.9478 6.4747 1.2942 16.965-5.4449 21.525-1.8887 1.278-5.5669 2.9655-8.1738 3.75-6.2344 1.8763-22.578 1.7444-28.146-0.22714zm25.594-11.09c3.5042-2.6042 3.946-6.5715 0.96438-8.6599-3.0489-2.1355-15.795-2.1859-19.87-0.0785-2.9746 1.5382-4.7447 5.4109-3.4389 7.5237 2.6249 4.2472 17.198 5.0394 22.344 1.2147zm-4.4186-38.672c5.6873-2.3763 7.2676-8.1293 3.5362-12.873-2.5212-3.2052-6.9123-4.2217-11.581-2.6808-7.2153 2.3813-7.8844 12.548-1.0223 15.535 3.9876 1.7356 4.9541 1.7376 9.0673 0.019zm-196.2 25.764c-2.8954-0.62713-2.91 0.11915 0.73789-37.778 2.0295-21.084 3.3807-31.186 4.2446-31.735 1.4388-0.91328 9.2461-1.0823 12.284-0.26594 2.0192 0.54265 7.7916 14.247 16.033 38.062l3.1597 9.1313 8.3346-22.499c4.584-12.374 9.0041-23.168 9.8223-23.987 1.1-1.1 3.1254-1.3834 7.7726-1.0875 3.4567 0.22011 6.466 0.60497 6.6873 0.85525 0.71904 0.81326 6.7136 67.083 6.1505 67.994-0.92676 1.4995-7.2231 2.2198-11.198 1.281l-3.7782-0.89239-1.6281-18.758c-0.89546-10.317-1.8103-18.941-2.0329-19.163-0.22266-0.22266-3.2686 7.335-6.7687 16.795-3.5001 9.4598-7.0588 17.762-7.9082 18.45-1.829 1.4805-7.5523 1.6467-10.082 0.29279-1.1045-0.5911-4.186-7.38-8.0567-17.75-6.667-17.861-8.0157-20.504-8.0356-15.743-0.0193 4.622-2.8707 35.666-3.3168 36.112-0.68223 0.68224-10.049 1.1994-12.421 0.68574zm86-0.3794c-2.249-0.90398-2.25-0.91587-2.25-25.83 0-27.873-0.49737-26.139 7.5-26.139 7.9973 0 7.5-1.7326 7.5 26.132v24.918l-2.5651 0.97525c-3.1139 1.1839-7.1556 1.1617-10.185-0.0559zm31.131-0.87843c-4.5968-2.803-5.3806-6.4072-5.3806-24.74 0-16.28-0.01-16.351-2.25-16.383-3.6669-0.0518-5.75-2.3226-5.75-6.2681 0-3.4143 0.17292-3.5937 3.75-3.8898l3.75-0.31037 1-13h13l1 13 10 1v9l-10.642 0.60946 0.3212 15.028c0.28833 13.49 0.5191 15.172 2.255 16.44 1.6811 1.2274 2.2596 1.1984 4.4278-0.22227 2.3707-1.5533 2.5842-1.5228 4.3162 0.61618 2.8724 3.5472 2.3808 7.6886-1.1281 9.5031-4.2975 2.2223-14.747 2.0074-18.669-0.38391zm28.869 0.87843c-2.249-0.90398-2.25-0.91587-2.25-25.83 0-27.873-0.49737-26.139 7.5-26.139 8.0024 0 7.5-1.7739 7.5 26.482v25.268l-3.125 0.625c-4.0966 0.81932-6.867 0.70241-9.625-0.40616zm85.139-0.87361c-5.3384-3.2553-7.8214-7.7523-7.8571-14.23-0.0359-6.5256 1.9693-10.064 7.5731-13.365 2.7352-1.6111 5.194-2 12.645-2h9.2493l6.8e-4 -3.6786c1e-3 -7.7647-8.2363-10.125-18.44-5.2825-4.2058 1.9958-6.2371 1.4384-7.5742-2.0784-1.7161-4.5138-1.1497-5.4944 4.765-8.2501 4.8882-2.2775 7.0988-2.6803 14.75-2.6879 7.6357-8e-3 9.6264 0.34895 13.132 2.3522 7.2895 4.1653 8.3679 7.4501 8.3679 25.488 0 15.527 0.0103 15.598 2.5 17.229 3.0759 2.0154 3.1591 3.7161 0.31144 6.3691-3.013 2.807-9.4198 2.7555-12.46-0.10026l-2.2771-2.1392-4.9727 2.1392c-6.4474 2.7736-15.375 2.8798-19.713 0.23445zm20.41-10.373c0.81477-0.65709 1.1871-2.7552 1-5.6345l-0.29816-4.5876-4.8365-0.30832c-7.8904-0.50301-11.59 3.3398-8.5981 8.9305 1.9771 3.6943 9.0361 4.5813 12.733 1.6zm36.702 11.333c-5.8582-2.3977-7.4421-8.2887-7.4756-27.805-0.0228-13.296-0.15091-14.25-1.9137-14.25-3.4739 0-6.0023-3.1519-5.4146-6.75 0.47732-2.9224 0.87222-3.25 3.9173-3.25h3.3865v-6.393c0-7.2055 0.39585-7.607 7.5-7.607 7.0958 0 7.5 0.4071 7.5 7.5547v6.3408l5.25 0.30226c4.6458 0.26748 5.2883 0.5729 5.5829 2.654 0.18308 1.2934 0.062 3.4309-0.26905 4.75-0.53447 2.1295-1.1602 2.3983-5.5829 2.3983h-4.981v14.389c0 12.568 0.23677 14.682 1.8709 16.7 1.8475 2.2816 1.9059 2.2874 4.6778 0.47124 2.767-1.813 2.8329-1.8072 4.6291 0.41116 2.8724 3.5472 2.3808 7.6886-1.1281 9.5031-3.1619 1.6351-14.09 1.9964-17.55 0.58032zm35.515-1.7582c-8.2313-4.3298-11.281-9.8134-11.829-21.27-0.53037-11.093 1.4211-17.634 6.894-23.107 7.2022-7.2022 20.815-8.8847 30.162-3.7281 6.3793 3.519 9.0602 9.1263 9.5821 20.041l0.41918 8.7676h-16.122c-17.979 0-18.189 0.0989-14.171 6.6886 3.3592 5.5093 12.416 6.2752 21.101 1.7842 3.7369-1.9324 3.6444-1.9599 5.5033 1.6348 3.7283 7.2097-1.6465 10.993-16.556 11.653-8.9476 0.39622-9.8189 0.25293-14.985-2.4642zm19.679-32.536c-0.66435-4.9531-3.5156-7.7602-7.8824-7.7602-4.0676 0-8.8123 4.8043-8.8123 8.9231v3.0769h17.263zm26.305 34.345-2.5-0.69512-0.26352-33.888c-0.20565-26.445 0.014-34.064 1-34.69 1.5835-1.0052 11.867-1.0568 13.408-0.0674 0.62951 0.40408 7.492 10.59 15.25 22.636l14.105 21.901v-22.044c0-19.179 0.2056-22.123 1.5818-22.651 2.0202-0.77521 9.2402-0.76139 12.168 0.0233l2.25 0.60298v33.915c0 38.403 0.74386 35.344-8.5963 35.349-2.803 2e-3 -5.761-0.54881-6.5734-1.223-0.8124-0.67424-7.5191-10.634-14.904-22.133l-13.427-20.907-1 43.177-2.5 0.69432c-3.1837 0.88421-6.8181 0.88392-10-8e-4zm87 0.0529c-2.4914-0.74125-2.5017-0.7951-3-15.701l-0.5-14.957-10.75-18.23c-5.9125-10.027-10.75-18.641-10.75-19.143 0-2.3274 11.439-3.0313 14.247-0.8768 1.9977 1.5325 11.302 17.584 13.766 23.75l1.7988 4.5 1.1542-3c2.2897-5.9513 13.279-24.561 15.07-25.52 2.2713-1.2156 10.971-1.2612 12.857-0.0675 1.5352 0.97215 0.89759 2.2446-13.312 26.562l-7.5817 12.975v14.216c0 7.8186-0.41268 14.471-0.91707 14.782-1.6358 1.011-9.5149 1.4737-12.083 0.70964zm-701.29-26.78c-0.39138-0.39137-0.71159-4.649-0.71159-9.4615v-8.7499l-6.5488-11.1c-3.6019-6.105-6.2753-11.542-5.941-12.083 0.89938-1.4552 9.1367-1.1938 10.669 0.33866 0.7272 0.7272 2.6718 4.078 4.3214 7.4462 1.6496 3.3682 3.2242 6.1298 3.4992 6.1368 0.275 7e-3 1.5242-2.1729 2.7759-4.8443 3.8933-8.3087 5.7633-10.061 10.738-10.061 2.4026 0 4.6434 0.44488 4.9794 0.98862 0.33605 0.54375-2.2249 5.8312-5.691 11.75l-6.302 10.761-1 19-5.0384 0.29492c-2.7711 0.16221-5.3586-0.0253-5.75-0.41667zm34.739-0.78485c-11.25-4.9004-14.35-25.805-5.3459-36.06 3.6734-4.1838 8.5024-5.8934 16.477-5.8334 11.343 0.0854 17.605 5.2715 19.651 16.275 2.1112 11.353-1.7883 21.688-9.5772 25.384-4.2423 2.0131-16.802 2.1518-21.205 0.23413zm14.605-7.623c6.4914-3.4741 6.56-21.43 0.095-24.89-8.3713-4.4802-15.595 5.0532-13.003 17.161 1.548 7.2312 7.3488 10.705 12.908 7.7293zm23.657 8.4091c-0.39202-0.39202-0.71277-9.827-0.71277-20.967v-20.254l3.25-0.72758c5.5547-1.2436 17.039-0.75511 20.982 0.89237 8.2332 3.4401 10.292 14.445 3.9295 21.009l-3.1209 3.22 4.8979 8.1478c5.4298 9.0326 5.3568 9.2991-2.5452 9.2991-4.224 0-4.577-0.22782-7.1682-4.6258-4.6861-7.9536-6.7717-10.874-7.7652-10.874-0.52809 0-1.1852 3.375-1.4602 7.5l-0.5 7.5-4.5372 0.2961c-2.4955 0.16286-4.858-0.0246-5.25-0.41667zm17.821-25.823c2.9611-2.9611 2.1595-6.5519-1.7766-7.9586-4.1804-1.494-5.7576-0.20556-5.7576 4.7038 0 2.4006 0.3 4.6647 0.66667 5.0314 1.3869 1.3869 4.5126 0.5783 6.8675-1.7766zm20.934 25.22c-0.28142-0.73338-0.38933-10.321-0.2398-21.305l0.27188-19.972h10l1 19 14.591-19.601 5.1258 0.30068c2.8192 0.16538 5.2698 0.75068 5.4458 1.3007 0.17597 0.55-2.6265 4.9774-6.2277 9.8386l-6.5476 8.8386 7.6221 10.562c8.3981 11.637 8.4129 12.219 0.31191 12.246-5.4437 0.0178-5.7411-0.22585-13.492-11.051-3.124-4.3634-6.0344-7.9335-6.4674-7.9335s-0.91674 4.1625-1.0749 9.25l-0.28753 9.25-4.7602 0.30521c-3.2727 0.20983-4.9201-0.11146-5.2719-1.0282zm218.28-30.466c-1.39-0.36326-1.75-1.5515-1.75-5.777 0-6.0187 0.59113-6.5337 7.5-6.5337 6.8997 0 7.5 0.51947 7.5 6.4904 0 4.6265-0.27714 5.3506-2.25 5.8794-2.5099 0.67261-8.3196 0.64143-11-0.059zm60 0c-1.39-0.36326-1.75-1.5515-1.75-5.777 0-6.0187 0.59113-6.5337 7.5-6.5337 6.9018 0 7.5 0.51846 7.5 6.5 0 3.8977-0.41545 5.4454-1.5818 5.893-1.7617 0.67603-8.9606 0.62523-11.668-0.0823zm-399.75-43.204c0-22.787-0.18128-22.107 5.8907-22.107 3.8592 0 4.9452 1.1525 12.701 13.478l6.9081 10.978 0.28474-11.44c0.30253-12.155 0.64114-12.973 5.3835-13 6.0005-0.0344 5.8318-0.67503 5.8318 22.142v20.943l-11.415-0.59981-14.085-22.489-0.28174 11.495-0.28173 11.495h-10.937zm45-0.63601v-21.529l13.238 0.27903c14.408 0.30369 14.804 0.49255 13.332 6.3581-0.57508 2.2913-1.008 2.4209-8.0886 2.4209h-7.481v6.9002l11.5 0.59981v8l-11.5 0.59981v9.8193l16.5 0.58088 0.31037 3.75 0.31036 3.75h-28.121zm40.115 14.827c-1.099-3.739-3.6605-12.648-5.6922-19.798-2.0317-7.15-3.8898-13.52-4.1291-14.155-0.56626-1.5035 4.8771-2.6859 8.6002-1.8682 2.7135 0.59599 3.0658 1.2717 5.645 10.829 1.513 5.6066 3.0598 10.79 3.4374 11.518 0.37756 0.72851 1.741-3.4805 3.0298-9.3534 2.4198-11.026 3.714-13.471 7.1308-13.471 4.4523 0 5.5029 1.6563 7.8996 12.454 1.2875 5.8004 2.6055 10.546 2.9289 10.546 0.32345 0 1.8887-4.7494 3.4784-10.554 3.0367-11.089 4.055-12.459 9.2402-12.43 5.8506 0.0318 5.8473 0.20664-0.41561 22.078l-5.8433 20.406-11.322 0.59673-1.0001-3.7984c-0.55005-2.0891-1.7838-6.9484-2.7416-10.798l-1.7415-7-5.2201 21-11.286 0.59643z"
    />
  </svg>
)


const Logo = ({sideNav}) => {

  return (
    <>
      <Link to="/" className={`flex `}>
        <div className='h-12 pl-3 pr-2 flex items-center '>
          <MNYLogo height={50} width={190} color={'#37576b'}/>
        </div>  
      </Link>
    </>
  )
}

const theme = {
  navOptions: {
    logo: <Logo />,//'',//<Link to='/' className='h-12 flex px-4 items-center'><div className='rounded-full h-8 w-8 bg-blue-500 border-2 border-blue-300 hover:bg-blue-600' /></Link>, //<Link to='/' className='h-12 flex px-4 items-center'>LOGO</Link>,
    sideNav: {
      size: 'none',
      search: 'none',
      logo: 'top',
      dropdown: 'none',
      nav: 'none'
    },
    topNav: {
      size: 'compact',
      dropdown: 'right',
      search: 'right',
      logo: 'left',
      position: 'fixed',
      nav: 'main' 
    }
  },
  heading: {
    "base": "p-2 w-full font-sans font-medium text-md bg-transparent",
    "1": `font-[500]  text-[#2D3E4C] text-[36px] leading-[36px] tracking-[-.02em] font-[500] underline-offset-8 underline decoration-4 decoration-[#EAAD43] uppercase font-['Oswald'] pb-[12px]`,
    "2": `font-[500]  text-[#2D3E4C] text-[24px] leading-[24px] scroll-mt-36 font-['Oswald'] pb-[12x]`,
    "3": `font-[500]  text-[#2D3E4C] text-[16px] leading-[16px] scroll-mt-36 font-['Oswald'] pb-[12x]`,
    "default": ''                                                                        
  },
  levelClasses: {
    '1': ' pt-2 pb-1 uppercase text-sm text-blue-400 hover:underline cursor-pointer border-r-2 mr-4',
    '2': 'pl-2 pt-2 pb-1 uppercase text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
    '3': 'pl-4 pt-2 pb-1 text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
    '4': 'pl-6 pt-2 pb-1 text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
  },
  layout: {
    wrapper: '',
    wrapper2: 'flex-1 flex items-start flex-col items-stretch max-w-full',
    wrapper3: 'flex flex-1',
    childWrapper: 'h-full flex-1',
    topnavContainer2:`fixed top-0 z-20 max-w-[1440px] w-full px-4  xl:px-[64px] pointer-events-none`,
    sidenavContainer1: 'pr-2  hidden lg:block min-w-[222px] max-w-[222px]',
    sidenavContainer2: 'hidden lg:block fixed min-w-[222px] max-w-[222px] top-[0px] h-[calc(100vh_-_1px)] bg-white hadow-md w-full overflow-y-auto overflow-x-hidden'
  },
  page: {
    container: `bg-[linear-gradient(0deg,rgba(244,244,244,0.96),rgba(244,244,244,0.96)),url('/themes/mny/topolines.png')]  bg-[size:500px] pb-[4px]`,//`bg-gradient-to-b from-[#F4F4F4] to-[#F4F4F4] bg-[url('/themes/mny/topolines.png')] `,
    wrapper1: 'w-full h-full flex-1 flex flex-col ', // first div inside Layout
    wrapper2: 'w-full h-full flex-1 flex flex-row p-4 min-h-screen', // inside page header, wraps sidebar
    wrapper3: 'flex flex-1 w-full border-2 flex-col border shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4' , // content wrapepr
    iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
    icon: 'text-slate-400 hover:text-blue-500'
  },

  sectionArray: {
    container: 'w-full grid grid-cols-6 md:grid-cols-12 ',
    layouts: {
        centered: 'max-w-[1440px] mx-auto md:gap-[12px] px-0 lg:px-[56px]',
        fullwidth: 'md:gap-[12px] px-0 lg:px-[56px'
    },
    sizes: {
        "1/4": { className: 'col-span-6 md:col-span-3', iconSize: 25 },
        "1/3": { className: 'col-span-6 md:col-span-4', iconSize: 33 },
        "1/2": { className: 'col-span-6 md:col-span-6', iconSize: 50 },
        "2/3": { className: 'col-span-6 md:col-span-8', iconSize: 66},
        "1": { className: 'col-span-6 md:col-span-9', iconSize: 75 },
        "2":   { className: 'col-span-6 md:col-span-12', iconSize: 100 },
    }
  },
  pageControls: {
    controlItem: 'pl-6 py-0.5 text-md cursor-pointer hover:text-blue-500 text-slate-400 flex items-center',
    select: 'bg-transparent border-none rounded-sm focus:ring-0 focus:border-0 pl-1',
    selectOption: 'p-4 text-md cursor-pointer hover:text-blue-500 text-slate-400 hover:bg-blue-600',
  },
  navPadding: {
    1: '',
    2: '',
    3: ''
  },
  lexical: {
    editorShell: "font-['Proxima_Nova'] font-[400] text-[16px] text-[#37576B] leading-[22.4px]",
    heading: {
      h1: "font-[500]  text-[#2D3E4C] text-[36px] leading-[36px] tracking-[-.02em] font-[500] underline-offset-8 underline decoration-4 decoration-[#EAAD43] uppercase font-['Oswald'] pb-[12px]", //'PlaygroundEditorTheme__h1',
      h2: "font-[500]  text-[#2D3E4C] text-[24px] leading-[24px] scroll-mt-36 font-['Oswald'] pb-[12x]", //'PlaygroundEditorTheme__h2',
      h3: "font-[500]  text-[#2D3E4C] text-[16px] leading-[16px] scroll-mt-36 font-['Oswald'] pb-[12x]", //'PlaygroundEditorTheme__h3',
      h4: "font-medium text-[#2D3E4C] scroll-mt-36 font-display", //'PlaygroundEditorTheme__h4',
      h5: "scroll-mt-36 font-display", //'PlaygroundEditorTheme__h5',
      h6: "scroll-mt-36 font-display", //'PlaygroundEditorTheme__h6',
    },
    paragraph: "m-0 relative", //'PlaygroundEditorTheme__paragraph',
    quote:
    "m-0 mb-2 font-['Oswald'] text-[30px] leading-[36px] text-[#2D3E4C] border-l-4 border-[#37576B] pl-4 pb-[12px]", //'PlaygroundEditorTheme__quote',

  },
  dataCard: {
    columnControlWrapper: 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-0.5',
    columnControlHeaderWrapper: `px-1 font-semibold border bg-gray-50 text-gray-500`,

    mainWrapperCompactView: 'grid',
    mainWrapperSimpleView: 'flex flex-col',

    subWrapper: 'w-full text-[#2D3E4C] font-[Oswald]',
    subWrapperCompactView: 'flex flex-col flex-wrap rounded-[12px] divide-y',
    subWrapperSimpleView: 'grid',

    headerValueWrapper: 'w-full rounded-[12px] flex items-center gap-[8px] justify-center p-2',
    headerValueWrapperCompactView: 'rounded-none py-[12px]',
    headerValueWrapperSimpleView: '',
    justifyTextLeft: 'w-full text-start',
    justifyTextRight: 'text-end',
    justifyTextCenter: 'text-center',

    textXS: 'font-medium font-[Oswald] text-[12px] leading-[140%]',
    textXSReg: 'font-normal font-[Proxima Nova] text-[12px] leading-[100%] uppercase',
    textSM: 'font-medium font-[Oswald] text-[14px] leading-[100%] uppercase',
    textSMReg: 'font-normal font-[Proxima Nova] text-[14px] leading-[140%]',
    textSMBold: 'font-normal font-[Proxima Nova] text-[14px] leading-[140%]',
    textSMSemiBold: 'font-semibold font-[Proxima Nova] text-[14px] leading-[140%]',
    textMD: 'font-medium font-[Oswald] text-[16px] leading-[100%] uppercase',
    textMDReg: 'font-normal font-[Proxima Nova] text-[16px] leading-[140%]',
    textMDBold: 'font-bold font-[Proxima Nova] text-[16px] leading-[140%]',
    textMDSemiBold: 'font-semibold font-[Proxima Nova] text-[16px] leading-[140%]',
    textXL: 'font-medium font-[Oswald] text-[20px] leading-[100%] uppercase',
    textXLSemiBold: 'font-semibold font-[Proxima Nova] text-[20px] leading-[120%]',
    text2XL: 'font-medium font-[Oswald] text-[24px] leading-[100%] uppercase',
    text2XLReg: 'font-regular font-[Oswald] text-[24px] leading-[120%] uppercase',
    text3XL: 'font-medium font-[Oswald] text-[30px] leading-[100%] uppercase tracking-[-0.05em]',
    text3XLReg: 'font-normal font-[Oswald] text-[30px] leading-[120%] uppercase',
    text4XL: 'font-medium font-[Oswald] text-[36px] leading-[100%] uppercase tracking-[-0.05em]',
    text5XL: 'font-medium font-[Oswald] text-[48px] leading-[100%] uppercase tracking-[-0.05em]',
    text6XL: 'font-medium font-[Oswald] text-[60px] leading-[100%] uppercase',
    text7XL: 'font-medium font-[Oswald] text-[72px] leading-[100%] uppercase tracking-normal',
    text8XL: 'font-medium font-[Oswald] text-[96px] leading-[95%] uppercase tracking-normal ',

    header: 'w-full flex-1 uppercase text-[#37576B]',
    headerCompactView: '',
    headerSimpleView: '',
    value: 'w-full text-[#2D3E4C]',
    valueCompactView: '',
    valueSimpleView: ''
  },
  sidenav: {
    fixed: ``,
   "logoWrapper": "full p-2 bg-neutral-100 text-slate-800",
   "topNavWrapper": "flex flex-row md:flex-col p-2", //used in layout
   "sidenavWrapper": "hidden md:block border-r w-full h-full z-20",
   "menuItemWrapper": "flex flex-col hover:bg-blue-50",
   "menuIconSide": "group px-2 mr-2 text-blue-500  group-hover:text-blue-800",
   "menuIconSideActive": "group px-2 w-6 mr-2 text-blue-500  group-hover:text-blue-800",
   "itemsWrapper": "border-slate-200 pt-5  ",
   "navItemContent": "transition-transform duration-300 ease-in-out flex-1",
   "navItemContents": ['text-[14px] font-light text-slate-700 px-4 py-2'],
   "navitemSide": `
    group  flex flex-col
    group flex 
    focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
    transition-all cursor-pointer border-l-2 border-white`,
   "navitemSideActive": `
    group  flex flex-col   
      focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
    transition-all cursor-pointer border-l-2 border-blue-500`,
   "indicatorIcon": "ArrowRight",
   "indicatorIconOpen": "ArrowDown",
   "indicatorIconWrapper" : "size-4 text-[#37576B]",
   "subMenuWrappers": ['w-full bg-[#F3F8F9] rounded-[12px]','w-full bg-[#E0EBF0]'],
   "subMenuOuterWrappers": ['pl-4'],
   "subMenuWrapper": "pl-2 w-full",
   "subMenuParentWrapper": "flex flex-col w-full",
   "bottomMenuWrapper": ""
  },
  topnav: {
      fixed: 'mt-8',
      topnavWrapper: `px-[24px] py-[16px] w-full bg-white h-20 flex items-center rounded-lg shadow pointer-events-auto`,
      topnavContent: `flex items-center w-full h-full  max-w-[1400px] mx-auto `,
      topnavMenu: `hidden  md:flex items-center flex-1  h-full overflow-x-auto overflow-y-hidden scrollbar-sm`,
      menuItemWrapper: 'flex text-[#37576B]',
      menuIconTop: `text-blue-400 mr-3 text-lg group-hover:text-blue-500`,
      menuIconTopActive : `text-blue-500 mr-3 text-lg group-hover:text-blue-500`,
      menuOpenIcon: `fa-light fa-bars fa-fw`,
      menuCloseIcon: `fa-light fa-xmark fa-fw"`,
      navitemTop: `
          w-fit group font-display whitespace-nowrap
          flex tracking-widest items-center font-[Oswald] font-medium text-slate-700 text-[11px] px-2 h-12
          focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
          transition cursor-pointer
      `,
      navitemTopActive:
        ` w-fit group font-display whitespace-nowrap
          flex tracking-widest items-center font-[Oswald] font-medium text-slate-700 text-[11px] px-2 h-12 text-blue
          focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
          transition cursor-pointer 
        `,
      //`px-4 text-sm font-medium tracking-widest uppercase inline-flex items-center  border-transparent  leading-5 text-white hover:bg-white hover:text-darkblue-500 border-gray-200 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out h-full`,
      topmenuRightNavContainer: "hidden md:flex h-full items-center",
      topnavMobileContainer: "bg-slate-50",
     
      mobileButton:`md:hidden bg-slate-100 inline-flex items-center justify-center pt-[12px] px-2 hover:text-blue-400  text-gray-400 hover:bg-gray-100 `,
      indicatorIcon: 'fal fa-angle-down pl-2 pt-1',
      indicatorIconOpen: 'fal fa-angle-down pl-2 pt-1',
      subMenuWrapper: `hidden`, 
      subMenuParentWrapper: 'hidden',
      subMenuWrapperChild: `divide-x overflow-x-auto max-w-[1400px] mx-auto`,
      subMenuWrapperTop: 'hidden',
      subMenuWrapperInactiveFlyout: `absolute left-0 right-0  mt-8 normal-case bg-white shadow-lg z-10 p-2`,
      subMenuWrapperInactiveFlyoutBelow: ` absolute ml-40 normal-case bg-white shadow-lg z-10 p-2`,
      subMenuWrapperInactiveFlyoutDirection: 'grid grid-cols-4'
      
  },
  table: {
      tableContainer: 'relative flex flex-col w-full h-full overflow-x-auto scrollbar-sm border rounded-t-[12px]',
      tableContainerNoPagination: 'rounded-b-[12px]',
      tableContainer1: 'flex flex-col no-wrap min-h-[200px] max-h-[calc(78vh_-_10px)] overflow-y-auto scrollbar-sm',
      headerContainer: 'sticky top-0 grid ',
      thead: 'flex justify-between',
      theadfrozen: '',
      thContainer: 'w-full font-[500] py-4 pl-4 pr-0 font-[Oswald] text-[12px] uppercase text-[#2d3e4c] border-x',
      thContainerBg: 'bg-[#F3F8F9] text-gray-900',
      thContainerBgSelected: 'bg-gray-50 text-gray-900',
      cell: 'relative flex items-center min-h-[36px]  border border-slate-50',
      cellInner: `
          w-full min-h-full flex flex-wrap items-center truncate py-1 px-2
          font-['Proxima_Nova'] font-[400] text-[14px] text-[#37576B] leading-[20px]
      `,
      cellBg: 'bg-white',
      cellBgSelected: 'bg-blue-50',
      cellFrozenCol: '',
      paginationContainer: 'w-full p-2 rounded-b-[12px] bg-[#F3F8F9] flex items-center justify-between',
      paginationInfoContainer: '',
      paginationPagesInfo: 'font-[500] font-[Oswald] text-[12px] uppercase text-[#2d3e4c] leading-[18px]',
      paginationRowsInfo: 'text-xs font-[Proxima Nova] leading-[14px]',
      paginationControlsContainer: 'flex flex-row items-center border rounded-[8px] overflow-hidden',
      pageRangeItem: 'cursor-pointer px-[12px]  py-[7px] font-[Oswald] font-[500] text-[12px] border-r last:border-none uppercase leading-[18px]' ,
      pageRangeItemInactive: 'bg-white text-[#2D3E4C]',
      pageRangeItemActive: 'bg-[#2D3E4C] text-white',
      openOutContainerWrapper: 'absolute inset-0 right-0 h-full w-full z-[100]',
      openOutHeader: 'font-semibold font-[Proxima Nova] text-[#37576B] text-[14px] leading-[17.05px]',
      openOutValue: 'font-normal font-[Proxima Nova] text-[#37576B] text-[14px] leading-[19.6px]',
      openOutTitle: 'font-medium font-[Oswald] text-[24px] leading-[100%] uppercase text-[#2D3E4C]'
  },
  attribution: {
    wrapper: 'w-full flex flex-col gap-[4px] text-[#2D3E4C] text-xs',
    label: 'font-semibold text-[12px] leading-[14.62px] border-t pt-[14px]',
    link: 'font-normal leading-[14.62px] text-[12px] underline'
  },
  sectionGroup: {
    default: {
      wrapper1: 'w-full h-full flex-1 flex flex-row p-2', // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full border-2 flex-col border shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4 h-full min-h-[200px]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'w-64 hidden xl:block',
      sideNavContainer2: 'w-64 sticky top-20 hidden xl:block'
    },
    content: {
      wrapper1: 'w-full h-full flex-1 flex flex-row p-2 ', // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full border-2 flex-col border shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4 h-full min-h-[calc(100vh_-_102px)]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'w-64 hidden xl:block',
      sideNavContainer2: 'w-64 sticky top-20 hidden xl:block'
    },
    darkSection: {
      wrapper1: `w-full h-full flex-1 flex flex-row -my-8 py-10 bg-[linear-gradient(0deg,rgba(33,52,64,.96),rgba(55,87,107,.96)),url('/themes/mny/topolines.png')]  bg-[size:500px] pb-[4px]`, // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full max-w-[1332px]  mx-auto flex-col  relative text-md font-light leading-7 p-4 h-full min-h-[200px]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'w-64 hidden xl:block',
      sideNavContainer2: 'w-64 sticky top-20 hidden xl:block'
    },
    lightCentered: {
      wrapper1: `w-full h-full flex-1 flex flex-row pb-[4px]`, // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full max-w-[1332px]  mx-auto border shadow-md bg-white rounded-lg  flex-col  relative text-md font-light leading-7 p-4 h-full min-h-[200px]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'w-64 hidden xl:block',
      sideNavContainer2: 'w-64 sticky top-20 hidden xl:block'
    },
    clearCentered: {
      wrapper1: `w-full h-full flex-1 flex flex-row pb-[4px]`, // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full max-w-[1332px]  mx-auto flex-col relative h-full min-h-[200px]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'w-64 hidden xl:block',
      sideNavContainer2: 'w-64 sticky top-20 hidden xl:block'
    },
    header: {
      wrapper1: 'w-full h-full flex-1 flex flex-row', // inside page header, wraps sidebar
      wrapper2: 'flex flex-1 w-full  flex-col  relative min-h-[200px]' , // content wrapepr
      iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
      icon: 'text-slate-400 hover:text-blue-500',
      sideNavContainer1: 'hidden',
      sideNavContainer2: 'hidden',
    }
  },
}

//theme.navOptions.logo = <Link to='/' className='h-12 flex px-4 items-center'><div className='rounded-full h-10 bg-blue-500 border border-slate-50' /></Link>

export default theme

export const themeOptions = {
  "topNav": {
    "label": "Top Nav",
    "defaultOpen": true,
    "controls": {
      "size": {
        "label": "Size",
        "type": "select",
        "options": [
          "none",
          "compact"
        ]
      },
      "logo": {
        "label": "Logo",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "search": {
        "label": "Search",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "dropdown": {
        "label": "Menu",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "nav": {
        "label": "Navigation",
        "type": "select",
        "options": [
          "none",
          "main",
          "secondary"
        ]
      }
    }
  },
  "sideNav": {
    "label": "Side Nav",
    "defaultOpen": false,
    "controls": {
      "size": {
        "label": "Size",
        "type": "select",
        "options": [
          "none",
          "full"
        ]
      },
      "depth": {
        "label": "Depth",
        "type": "select",
        "options": [
          1,2
        ]
      },
      "logo": {
        "label": "Logo",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "search": {
        "label": "Search",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "dropdown": {
        "label": "Menu",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "nav": {
        "label": "Navigation",
        "type": "select",
        "options": [
          "none",
          "main",
          "secondary"
        ]
      }
    }
  },
  "secondaryNav": {
    "label": "Secondary Nav",
    "defaultOpen": false,
    "controls": {
      "navItems": {
        "label": "Nav Items",
        "type": "menu"
      }
    }
  },
  "authMenu": {
    "label": "Auth Menu",
    "defaultOpen": false,
    "controls": {
      "navItems": {
        "label": "Nav Items",
        "type": "menu"
      }
    }
  }
}