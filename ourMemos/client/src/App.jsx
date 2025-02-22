import { BrowserRouter, Routes, Route } from "react-router-dom"

import { WorldMemos } from "./pages/WorldMemos"
import { MyMemos } from "./pages/MyMemos"
import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import { PostMemo } from "./pages/PostMemo"
import { Error } from "./pages/Error"
import { Logout } from "./pages/Logout"
import { Settings } from "./pages/Settings"

import { Groups } from "./pages/Groups"
import { CreateGroup } from "./pages/CreateGroup"
import { AddGroupMembers } from "./pages/AddGroupMembers"
import { GroupMemo } from "./pages/GroupMemo"
import { PostGroupMemo } from "./pages/PostGroupMemo"

import { SearchWorldMemos } from "./pages/SearchWorldMemos"
import { SearchGroupMemos } from "./pages/SearchGroupMemos"
import { SearchGroups } from "./pages/SearchGroups"
import { SearchAddGroupMembers } from "./pages/SearchAddGroupMembers"


import { AdminLayout } from "./layouts/AdminLayout"
import { AdminMemos } from "./layouts/AdminMemos"

import { SearchAdminLayout } from "./layouts/SearchAdminLayout"

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorldMemos />}/>
        <Route path="/search/:query" element={<SearchWorldMemos />}/>
        <Route path="/mymemos" element={<MyMemos />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/postmemo" element={<PostMemo />}/>
        <Route path="/logout" element={<Logout />}/>
        <Route path="/settings" element={<Settings />}/>
        <Route path="/admin" element={ <AdminLayout /> }/>
        <Route path="/admin/search/:query" element={<SearchAdminLayout />}/>
        <Route path="/admin/memos/user/:id" element={ <AdminMemos /> }/>
        <Route path="/groups" element={<Groups />}/>
        <Route path="/groups/search/:query" element={<SearchGroups />}/>
        <Route path="/group/create" element={<CreateGroup />}/>
        <Route path="/group/addmembers/:id" element={<AddGroupMembers />}/>
        <Route path="/group/addmembers/:id/search/:query" element={<SearchAddGroupMembers />}/>
        <Route path="/group/:id" element={<GroupMemo />}/>
        <Route path="/group/:id/search/:query" element={<SearchGroupMemos />}/>
        <Route path="/group/post/:id" element={<PostGroupMemo />}/>
        <Route path="*" element={<Error />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App